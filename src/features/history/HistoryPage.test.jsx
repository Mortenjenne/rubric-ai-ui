import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { HistoryPage } from './HistoryPage'
import { ResultPage } from '../result/ResultPage'
import { server } from '../../test/mocks/server'
import { buildEvaluation, buildEvaluationSummary } from '../../test/fixtures/evaluation'

function renderHistory() {
  const client = new QueryClient()
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/history']}>
        <Routes>
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/evaluations/:evaluationId" element={<ResultPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('HistoryPage', () => {
  it('shows a loading state, then one row per Evaluation, newest first, with timestamp and advisory Suggested grade', async () => {
    const newest = buildEvaluationSummary({
      evaluationId: 'eval-newest',
      createdAt: '2026-08-31T09:14:22.531Z',
      suggestedGrade: { value: '12', advisory: true },
    })
    const oldest = buildEvaluationSummary({
      evaluationId: 'eval-oldest',
      createdAt: '2026-08-20T09:14:22.531Z',
      suggestedGrade: { value: '7', advisory: true },
    })
    server.use(http.get('*/api/evaluations', () => HttpResponse.json([newest, oldest])))

    renderHistory()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => expect(screen.getByText(newest.createdAt)).toBeInTheDocument())
    expect(screen.getByText(oldest.createdAt)).toBeInTheDocument()

    const rows = screen.getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent(newest.createdAt)
    expect(rows[1]).toHaveTextContent(oldest.createdAt)

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getAllByText(/advisory/i)).toHaveLength(2)
  })

  it('shows the saved Label for a row when present, and a reasonable fallback when absent', async () => {
    const labeled = buildEvaluationSummary({ evaluationId: 'eval-labeled' })
    const unlabeled = buildEvaluationSummary({ evaluationId: 'eval-unlabeled' })
    localStorage.setItem('rubric-ai:labels', JSON.stringify({ 'eval-labeled': 'Anna' }))
    server.use(http.get('*/api/evaluations', () => HttpResponse.json([labeled, unlabeled])))

    renderHistory()

    await waitFor(() => expect(screen.getByText(/Anna/)).toBeInTheDocument())

    const rows = screen.getAllByRole('listitem')
    expect(rows[0]).toHaveTextContent('Anna')
    expect(rows[1]).not.toHaveTextContent('Anna')
    expect(rows[1].textContent.trim().length).toBeGreaterThan(0)
  })

  it('renders without breaking when there are no past Evaluations', async () => {
    server.use(http.get('*/api/evaluations', () => HttpResponse.json([])))

    renderHistory()

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument())
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('clicking a row navigates to that Evaluation\'s Result view', async () => {
    const summary = buildEvaluationSummary({ evaluationId: 'eval-click-through' })
    const fullEvaluation = buildEvaluation({ evaluationId: 'eval-click-through' })
    server.use(
      http.get('*/api/evaluations', () => HttpResponse.json([summary])),
      http.get('*/api/evaluations/:evaluationId', () => HttpResponse.json(fullEvaluation)),
    )

    const user = userEvent.setup()
    renderHistory()

    const row = await screen.findByRole('link')
    await user.click(row)

    await waitFor(() =>
      expect(screen.getByText(fullEvaluation.overallAssessment)).toBeInTheDocument(),
    )
  })

  it('shows a retryable error when the history fetch fails', async () => {
    let requestCount = 0
    server.use(
      http.get('*/api/evaluations', () => {
        requestCount += 1
        if (requestCount === 1) {
          return HttpResponse.json({ message: 'boom' }, { status: 503 })
        }
        return HttpResponse.json([buildEvaluationSummary()])
      }),
    )

    const user = userEvent.setup()
    renderHistory()

    const errorBox = await screen.findByRole('alert')
    await user.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1))
    expect(errorBox).not.toBeInTheDocument()
    expect(requestCount).toBe(2)
  })
})
