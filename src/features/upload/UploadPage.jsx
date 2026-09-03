import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader, Paperclip } from 'react-feather'
import { useCreateEvaluation } from './useCreateEvaluation'
import { getEvaluationErrorCopy } from './evaluationErrors'
import { saveLabel } from '../../shared/storage/labels'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { Button } from '../../shared/ui/Button'
import { strings } from '../../shared/i18n/strings'
import styles from './UploadPage.module.css'

export function UploadPage() {
  const [submissionText, setSubmissionText] = useState('')
  const [label, setLabel] = useState('')
  const [fileName, setFileName] = useState('')
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
    setFileName(file.name)
    event.target.value = ''
  }

  function submitEvaluation(text) {
    mutate(text, {
      onSuccess: (evaluation) => {
        saveLabel(evaluation.evaluationId, label)
        navigate(`/evaluations/${evaluation.evaluationId}`, {
          state: { evaluation, submissionText: text },
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
      <p className={styles.subheading}>{strings.upload.subheading}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="submission-text">{strings.upload.reportTextLabel}</label>
          <p className={styles.instruction}>{strings.upload.instruction}</p>
          <textarea
            id="submission-text"
            value={submissionText}
            onChange={(event) => setSubmissionText(event.target.value)}
            placeholder={strings.upload.textareaPlaceholder}
            disabled={isPending}
            className={styles.textarea}
          />
          <p className={styles.charCount}>{strings.upload.charCount(submissionText.length)}</p>
          <input
            id="submission-file"
            type="file"
            accept=".md,.txt"
            onChange={handleFileChange}
            disabled={isPending}
            className={styles.fileInput}
          />
          <label htmlFor="submission-file" className={styles.fileLabel}>
            <Paperclip aria-hidden="true" size={16} /> {strings.upload.fileLabel}
          </label>
          {fileName && <p className={styles.fileLoaded}>{strings.upload.fileLoaded(fileName)}</p>}
        </div>
        <div className={styles.field}>
          <label htmlFor="submission-label">{strings.upload.labelLabel}</label>
          <input
            id="submission-label"
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={strings.upload.labelPlaceholder}
            disabled={isPending}
            className={styles.labelInput}
          />
          <p className={styles.labelHelp}>{strings.upload.labelHelp}</p>
        </div>
        <div className={styles.actions}>
          <Button type="submit" disabled={!canSubmit} loading={isPending}>
            {isPending ? strings.upload.submitting : strings.upload.submit}
          </Button>
        </div>
        {isPending && (
          <p role="status" className={styles.progressStatus}>
            <Loader aria-hidden="true" size={16} className="spin-icon" />
            {strings.upload.progressStatus}
          </p>
        )}
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
