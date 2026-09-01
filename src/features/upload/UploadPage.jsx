import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateEvaluation } from './useCreateEvaluation'
import { saveLabel } from '../../shared/storage/labels'

export function UploadPage() {
  const [submissionText, setSubmissionText] = useState('')
  const [label, setLabel] = useState('')
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateEvaluation()

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

  function handleSubmit(event) {
    event.preventDefault()
    if (!submissionText.trim() || isPending) return

    mutate(submissionText, {
      onSuccess: (evaluation) => {
        saveLabel(evaluation.evaluationId, label)
        navigate(`/evaluations/${evaluation.evaluationId}`, {
          state: { evaluation },
        })
      },
    })
  }

  const canSubmit = submissionText.trim().length > 0 && !isPending

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
      </form>
    </section>
  )
}
