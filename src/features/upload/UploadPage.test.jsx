import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import App from '../../App'
import { server } from '../../test/mocks/server'
import { buildEvaluation } from '../../test/fixtures/evaluation'
import { expectEvaluationLanded } from '../../test/helpers/assertions'
import { getEvaluationErrorCopy } from './evaluationErrors'

function renderApp() {
  const client = new QueryClient()
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function createDeferred() {
  let resolve
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

describe('Upload flow', () => {
  it('shows the in-progress state, then navigates to the Evaluation view on success', async () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-123' })
    const deferred = createDeferred()
    server.use(
      http.post('*/api/evaluations', async () => {
        await deferred.promise
        return HttpResponse.json(evaluation)
      }),
    )

    const user = userEvent.setup()
    renderApp()

    await user.type(
      screen.getByLabelText(/indleveringstekst/i),
      'Jeg brugte C# og React til at bygge en løsning.',
    )
    await user.type(screen.getByLabelText(/mærkat/i), 'Anna')
    await user.click(screen.getByRole('button', { name: /indsend/i }))

    expect(screen.getByRole('button', { name: /vurderer/i })).toBeDisabled()
    expect(screen.getByText(/20 til 90 sekunder/i)).toBeInTheDocument()

    deferred.resolve()

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Vurdering' })).toBeInTheDocument(),
    )

    expectEvaluationLanded(evaluation)

    expect(JSON.parse(localStorage.getItem('rubric-ai:labels'))).toEqual({
      'eval-123': 'Anna',
    })
  })

  it('populates the textarea from an uploaded .txt file', async () => {
    const user = userEvent.setup()
    renderApp()

    const file = new File(['Report text from a file.'], 'report.txt', {
      type: 'text/plain',
    })
    await user.upload(screen.getByLabelText(/vælg en \.md- eller \.txt-fil/i), file)

    await waitFor(() =>
      expect(screen.getByLabelText(/indleveringstekst/i)).toHaveValue('Report text from a file.'),
    )
  })

  it('blocks submission of blank or whitespace-only text', async () => {
    let requestCount = 0
    server.use(
      http.post('*/api/evaluations', () => {
        requestCount += 1
        return HttpResponse.json(buildEvaluation())
      }),
    )

    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText(/indleveringstekst/i), '   ')
    const submitButton = screen.getByRole('button', { name: /indsend/i })

    expect(submitButton).toBeDisabled()

    await user.click(submitButton)

    expect(requestCount).toBe(0)
    expect(screen.getByRole('heading', { name: 'Indlevering' })).toBeInTheDocument()
  })

  it('warns before navigating away or reloading while a submission is in flight', async () => {
    const deferred = createDeferred()
    server.use(
      http.post('*/api/evaluations', async () => {
        await deferred.promise
        return HttpResponse.json(buildEvaluation())
      }),
    )

    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText(/indleveringstekst/i), 'Some report text.')
    await user.click(screen.getByRole('button', { name: /indsend/i }))

    const event = new Event('beforeunload', { cancelable: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()

    deferred.resolve()
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Vurdering' })).toBeInTheDocument(),
    )
  })

  describe.each([
    ['invalid_model_output', 422],
    ['rate_limited', 429],
    ['upstream_unavailable', 503],
  ])('when the evaluation fails with %s', (code, status) => {
    it('shows a non-blocking inline error whose Retry resubmits the same text', async () => {
      const evaluation = buildEvaluation()
      const requestBodies = []
      server.use(
        http.post('*/api/evaluations', async ({ request }) => {
          const body = await request.json()
          requestBodies.push(body.submissionText)
          if (requestBodies.length === 1) {
            return HttpResponse.json({ code, message: 'raw server detail' }, { status })
          }
          return HttpResponse.json(evaluation)
        }),
      )

      const user = userEvent.setup()
      renderApp()

      await user.type(screen.getByLabelText(/indleveringstekst/i), 'Some submission text.')
      await user.type(screen.getByLabelText(/mærkat/i), 'Anna')
      await user.click(screen.getByRole('button', { name: /indsend/i }))

      const errorBox = await screen.findByRole('alert')
      expect(errorBox).toHaveTextContent(getEvaluationErrorCopy(code).message)
      expect(errorBox).not.toHaveTextContent('raw server detail')
      expect(requestBodies).toEqual(['Some submission text.'])

      expect(screen.getByLabelText(/indleveringstekst/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/mærkat/i)).not.toBeDisabled()

      await user.click(within(errorBox).getByRole('button', { name: /prøv igen/i }))

      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Vurdering' })).toBeInTheDocument(),
      )
      expect(requestBodies).toEqual(['Some submission text.', 'Some submission text.'])
    })
  })

  it('shows configuration_error as a problem to report, with no Retry control', async () => {
    server.use(
      http.post('*/api/evaluations', () =>
        HttpResponse.json(
          { code: 'configuration_error', message: 'raw server detail' },
          { status: 500 },
        ),
      ),
    )

    const user = userEvent.setup()
    renderApp()

    await user.type(screen.getByLabelText(/indleveringstekst/i), 'Some submission text.')
    await user.click(screen.getByRole('button', { name: /indsend/i }))

    const errorBox = await screen.findByRole('alert')
    expect(errorBox).toHaveTextContent(getEvaluationErrorCopy('configuration_error').message)
    expect(errorBox).toHaveTextContent(/kontakt/i)
    expect(within(errorBox).queryByRole('button')).not.toBeInTheDocument()

    expect(screen.getByLabelText(/indleveringstekst/i)).not.toBeDisabled()
    expect(screen.getByLabelText(/mærkat/i)).not.toBeDisabled()
  })
})
