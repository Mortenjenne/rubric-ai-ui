import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { ResultPage } from './ResultPage'
import { server } from '../../test/mocks/server'
import { buildEvaluation } from '../../test/fixtures/evaluation'
import { expectEvaluationLanded } from '../../test/helpers/assertions'

function renderAt(initialEntry) {
  const client = new QueryClient()
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/evaluations/:evaluationId" element={<ResultPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function renderResult(evaluation) {
  return renderAt({ pathname: `/evaluations/${evaluation.evaluationId}`, state: { evaluation } })
}

function renderResultAtUrl(evaluationId) {
  return renderAt(`/evaluations/${evaluationId}`)
}

describe('ResultPage', () => {
  it('renders the overall assessment, one Finding per Criterion, the advisory grade, and dialogue questions', () => {
    const evaluation = buildEvaluation()
    renderResult(evaluation)

    expectEvaluationLanded(evaluation)

    for (const finding of evaluation.findings) {
      expect(screen.getByText(finding.strengths[0])).toBeInTheDocument()
      expect(screen.getByText(finding.weaknesses[0])).toBeInTheDocument()
      expect(screen.getByText(finding.improvements[0])).toBeInTheDocument()
      expect(screen.getByText(new RegExp(finding.evidence[0]))).toBeInTheDocument()
    }
  })

  it('never renders a Level as a number, and never renders the Suggested grade as a decided mark', () => {
    const evaluation = buildEvaluation()
    renderResult(evaluation)

    for (const finding of evaluation.findings) {
      expect(finding.level).toMatch(/Mangelfuldt|Acceptabelt|Tilfredsstillende|Udmærket/)
    }

    const advisoryNote = screen.getByText(/advisory/i)
    expect(advisoryNote.textContent).toMatch(/not a decided grade/i)
    expect(screen.queryByText(/final grade/i)).not.toBeInTheDocument()
  })

  it('shows the Label saved at upload time, keyed by evaluationId', () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-label-test' })
    localStorage.setItem('rubric-ai:labels', JSON.stringify({ 'eval-label-test': 'Anna' }))

    renderResult(evaluation)

    expect(screen.getByText(/Anna/)).toBeInTheDocument()
  })

  it('does not show a Label when none was saved for this evaluationId', () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-no-label' })

    renderResult(evaluation)

    expect(screen.queryByText(/^Label:/)).not.toBeInTheDocument()
  })
})

describe('ResultPage — reload / direct link (no router state)', () => {
  it('shows a loading state, then fetches the Evaluation via GET /api/evaluations/{id} and renders it', async () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-fetched' })
    server.use(
      http.get('*/api/evaluations/:evaluationId', ({ params }) => {
        expect(params.evaluationId).toBe('eval-fetched')
        return HttpResponse.json(evaluation)
      }),
    )

    renderResultAtUrl('eval-fetched')

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => expectEvaluationLanded(evaluation))
  })

  it('renders the same Result view for a direct link to a known id with no prior submission this session', async () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-direct-link' })
    server.use(
      http.get('*/api/evaluations/:evaluationId', () => HttpResponse.json(evaluation)),
    )

    renderResultAtUrl('eval-direct-link')

    await waitFor(() => expectEvaluationLanded(evaluation))

    const advisoryNote = screen.getByText(/advisory/i)
    expect(advisoryNote.textContent).toMatch(/not a decided grade/i)
    expect(screen.queryByText(/final grade/i)).not.toBeInTheDocument()
  })

  it('shows the Label saved at upload time for a fetched Evaluation', async () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-fetched-label' })
    localStorage.setItem('rubric-ai:labels', JSON.stringify({ 'eval-fetched-label': 'Anna' }))
    server.use(
      http.get('*/api/evaluations/:evaluationId', () => HttpResponse.json(evaluation)),
    )

    renderResultAtUrl('eval-fetched-label')

    await waitFor(() => expect(screen.getByText(/Anna/)).toBeInTheDocument())
  })

  it('shows a not-found message with no retry when no Evaluation exists with this id', async () => {
    server.use(
      http.get(
        '*/api/evaluations/:evaluationId',
        () =>
          HttpResponse.json(
            { code: 'evaluation_not_found', message: 'No Evaluation exists with id eval-missing' },
            { status: 404 },
          ),
      ),
    )

    renderResultAtUrl('eval-missing')

    const errorBox = await screen.findByRole('alert')
    expect(errorBox).toHaveTextContent(/no evaluation/i)
    expect(within(errorBox).queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows a not-found message with no retry when the id is malformed (400, no code)', async () => {
    server.use(
      http.get('*/api/evaluations/:evaluationId', () =>
        HttpResponse.json(
          { timestamp: '2026-09-02T00:00:00Z', status: 400, error: 'Bad Request' },
          { status: 400 },
        ),
      ),
    )

    renderResultAtUrl('not-a-uuid')

    const errorBox = await screen.findByRole('alert')
    expect(errorBox).toHaveTextContent(/no evaluation/i)
    expect(within(errorBox).queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows a retryable error when the fetch fails for another reason', async () => {
    let requestCount = 0
    server.use(
      http.get('*/api/evaluations/:evaluationId', () => {
        requestCount += 1
        if (requestCount === 1) {
          return HttpResponse.json({ message: 'boom' }, { status: 503 })
        }
        return HttpResponse.json(buildEvaluation({ evaluationId: 'eval-retry' }))
      }),
    )

    const user = userEvent.setup()
    renderResultAtUrl('eval-retry')

    const errorBox = await screen.findByRole('alert')
    await user.click(within(errorBox).getByRole('button', { name: /retry/i }))

    await waitFor(() =>
      expect(screen.getByText(/advisory/i)).toBeInTheDocument(),
    )
    expect(requestCount).toBe(2)
  })
})
