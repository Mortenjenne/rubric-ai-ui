import { useLocation, useParams } from 'react-router-dom'
import { getLabel } from '../../shared/storage/labels'
import { useEvaluation } from './useEvaluation'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { SuggestedGrade } from '../../shared/ui/SuggestedGrade'
import { strings } from '../../shared/i18n/strings'

function ListSection({ title, items }) {
  return (
    <>
      <h4>{title}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  )
}

function EvaluationView({ evaluation }) {
  const label = getLabel(evaluation.evaluationId)

  return (
    <>
      {label && (
        <p>
          {strings.evaluation.labelPrefix}: {label}
        </p>
      )}

      <p>{evaluation.overallAssessment}</p>

      <section>
        <h2>{strings.evaluation.suggestedGradeHeading}</h2>
        <SuggestedGrade grade={evaluation.suggestedGrade} />
      </section>

      <section>
        <h2>{strings.evaluation.findingsHeading}</h2>
        {evaluation.findings.map((finding) => (
          <article key={finding.criterion}>
            <h3>{finding.criterionName}</h3>
            <p>
              {strings.evaluation.levelPrefix}: <strong>{finding.level}</strong>
            </p>

            <ListSection title={strings.evaluation.strengths} items={finding.strengths} />
            <ListSection title={strings.evaluation.weaknesses} items={finding.weaknesses} />
            <ListSection title={strings.evaluation.improvements} items={finding.improvements} />

            <h4>{strings.evaluation.evidence}</h4>
            <ul>
              {finding.evidence.map((item, index) => (
                <li key={index}>&ldquo;{item}&rdquo;</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>{strings.evaluation.dialogueQuestionsHeading}</h2>
        <ul>
          {evaluation.dialogueQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

export function ResultPage() {
  const { evaluationId } = useParams()
  const location = useLocation()
  const submittedEvaluation = location.state?.evaluation
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

  return (
    <section>
      <h1>{strings.evaluation.heading}</h1>

      {isFetchPath && isPending && <p role="status">{strings.evaluation.loading}</p>}

      {isFetchPath && isError && isUnresolvableId && (
        <ErrorBox message={strings.evaluation.notFound(evaluationId)} />
      )}

      {isFetchPath && isError && !isUnresolvableId && (
        <ErrorBox
          message={strings.evaluation.loadError}
          actionLabel={strings.common.retry}
          onAction={refetch}
        />
      )}

      {evaluation && <EvaluationView evaluation={evaluation} />}
    </section>
  )
}
