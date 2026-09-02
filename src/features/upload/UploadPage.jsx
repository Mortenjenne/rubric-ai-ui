import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvaluation } from './useCreateEvaluation'
import { getEvaluationErrorCopy } from './evaluationErrors'
import { saveLabel } from '../../shared/storage/labels'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { strings } from '../../shared/i18n/strings'

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
      <h1>{strings.upload.heading}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="submission-text">{strings.upload.reportTextLabel}</label>
          <textarea
            id="submission-text"
            value={submissionText}
            onChange={(event) => setSubmissionText(event.target.value)}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="submission-file">{strings.upload.fileLabel}</label>
          <input
            id="submission-file"
            type="file"
            accept=".md,.txt"
            onChange={handleFileChange}
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="submission-label">{strings.upload.labelLabel}</label>
          <input
            id="submission-label"
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            disabled={isPending}
          />
        </div>
        <button type="submit" disabled={!canSubmit}>
          {isPending ? strings.upload.submitting : strings.upload.submit}
        </button>
        {isPending && <p role="status">{strings.upload.progressStatus}</p>}
        {errorCopy && (
          <ErrorBox
            message={errorCopy.message}
            actionLabel={errorCopy.retryable ? strings.common.retry : undefined}
            onAction={errorCopy.retryable ? handleRetry : undefined}
          />
        )}
      </form>
    </section>
  )
}
