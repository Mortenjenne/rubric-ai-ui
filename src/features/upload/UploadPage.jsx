import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvaluation } from './useCreateEvaluation'
import { getEvaluationErrorCopy } from './evaluationErrors'
import { saveLabel } from '../../shared/storage/labels'
import { ErrorBox } from '../../shared/ui/ErrorBox'

export function UploadPage() {
  const [submissionText, setSubmissionText] = useState('')
  const [label, setLabel] = useState('')
  const navigate = useNavigate()
  const { mutate, isPending, isError, error } = useCreateEvaluation()

  useEffect(() => {
    if (!isPending) return undefined

    function handleBeforeUnload(event) {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isPending])

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setSubmissionText(await file.text())
    event.target.value = ''
  }

  function submitEvaluation(text) {
    mutate(text, {
      onSuccess: (evaluation) => {
        saveLabel(evaluation.evaluationId, label)
        navigate(`/evaluations/${evaluation.evaluationId}`, {
          state: { evaluation },
        })
      },
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!submissionText.trim() || isPending) return
    submitEvaluation(submissionText)
  }

  function handleRetry() {
    submitEvaluation(submissionText)
  }

  const canSubmit = submissionText.trim().length > 0 && !isPending
  const errorCopy = isError ? getEvaluationErrorCopy(error?.code) : null

  return (
    <section>
      <h1>Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="submission-text">Report text</label>
          <textarea
            id="submission-text"
            value={submissionText}
            onChange={(event) => setSubmissionText(event.target.value)}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="submission-file">Or upload a .md or .txt file</label>
          <input
            id="submission-file"
            type="file"
            accept=".md,.txt"
            onChange={handleFileChange}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="submission-label">Label (optional)</label>
          <input
            id="submission-label"
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            disabled={isPending}
          />
        </div>
        <button type="submit" disabled={!canSubmit}>
          {isPending ? 'Evaluating…' : 'Submit'}
        </button>
        {isPending && (
          <p role="status">
            Evaluating the submission — this takes 20 to 90 seconds. Don&rsquo;t close or reload
            this page.
          </p>
        )}
        {errorCopy && (
          <ErrorBox
            message={errorCopy.message}
            actionLabel={errorCopy.retryable ? 'Retry' : undefined}
            onAction={errorCopy.retryable ? handleRetry : undefined}
          />
        )}
      </form>
    </section>
  )
}
