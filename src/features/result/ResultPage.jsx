import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getLabel } from '../../shared/storage/labels'
import { consumeSubmissionPanelOnce } from '../../shared/storage/submissionPanel'
import { useEvaluation } from './useEvaluation'
import { EvaluationColumn } from './EvaluationColumn'
import { SubmissionPanel } from './SubmissionPanel'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { SuggestedGrade } from '../../shared/ui/SuggestedGrade'
import { strings } from '../../shared/i18n/strings'
import styles from './ResultPage.module.css'

function useShowSubmissionPanelOnce(evaluationId, hasSubmissionText) {
  const [show] = useState(
    () => hasSubmissionText && consumeSubmissionPanelOnce(evaluationId),
  )
  return show
}

export function ResultPage() {
  const { evaluationId } = useParams()
  const location = useLocation()
  const submittedEvaluation = location.state?.evaluation
  const submissionText = location.state?.submissionText
  const isFetchPath = !submittedEvaluation

  const {
    data: fetchedEvaluation,
    isPending,
    isError,
    error,
    refetch,
  } = useEvaluation(evaluationId, { enabled: isFetchPath })

  const evaluation = submittedEvaluation ?? fetchedEvaluation
  // 404 (no such id) and 400 (malformed id) both mean this id will never resolve — retrying
  // can't help, unlike the transient failures documented for this endpoint.
  const isUnresolvableId = error?.code === 'evaluation_not_found' || error?.status === 400
  const label = evaluation ? getLabel(evaluation.evaluationId) : undefined
  const showSubmissionPanel = useShowSubmissionPanelOnce(
    evaluationId,
    Boolean(submittedEvaluation && submissionText),
  )

  return (
    <section>
      <h1>{strings.evaluation.heading}</h1>

      {isFetchPath && isPending && (
        <div className={styles.stateContainer} role="status">
          <span aria-hidden="true" className={styles.spinnerGlyph}>
            ◌
          </span>
          <p className={styles.stateHeading}>{strings.evaluation.loading}</p>
          <p className={styles.stateBody}>{strings.evaluation.loadingBody}</p>
        </div>
      )}

      {isFetchPath && isError && isUnresolvableId && (
        <div className={styles.stateContainer}>
          <ErrorBox message={strings.evaluation.notFound(evaluationId)} />
        </div>
      )}

      {isFetchPath && isError && !isUnresolvableId && (
        <div className={styles.stateContainer}>
          <ErrorBox
            message={strings.evaluation.loadError}
            actionLabel={strings.common.retry}
            onAction={refetch}
          />
        </div>
      )}

      {evaluation && (
        <div className={showSubmissionPanel ? styles.threeColumns : styles.twoColumns}>
          {showSubmissionPanel && (
            <SubmissionPanel submissionText={submissionText} label={label} />
          )}
          <EvaluationColumn evaluation={evaluation} label={showSubmissionPanel ? undefined : label} />
          <SuggestedGrade grade={evaluation.suggestedGrade} />
        </div>
      )}
    </section>
  )
}
