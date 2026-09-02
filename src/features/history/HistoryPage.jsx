import { Link } from 'react-router-dom'
import { getLabel } from '../../shared/storage/labels'
import { useEvaluations } from './useEvaluations'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { SuggestedGrade } from '../../shared/ui/SuggestedGrade'
import { strings } from '../../shared/i18n/strings'

function HistoryRow({ evaluation }) {
  const label = getLabel(evaluation.evaluationId)

  return (
    <li>
      <Link to={`/evaluations/${evaluation.evaluationId}`}>
        <time dateTime={evaluation.createdAt}>{evaluation.createdAt}</time>
        <p>{label ?? strings.history.noLabel}</p>
        <SuggestedGrade grade={evaluation.suggestedGrade} />
      </Link>
    </li>
  )
}

export function HistoryPage() {
  const { data: evaluations, isPending, isError, refetch } = useEvaluations()

  return (
    <section>
      <h1>{strings.history.heading}</h1>

      {isPending && <p role="status">{strings.history.loading}</p>}

      {isError && (
        <ErrorBox
          message={strings.history.loadError}
          actionLabel={strings.common.retry}
          onAction={refetch}
        />
      )}

      {evaluations && evaluations.length === 0 && <p>{strings.history.empty}</p>}

      {evaluations && evaluations.length > 0 && (
        <ul>
          {evaluations.map((evaluation) => (
            <HistoryRow key={evaluation.evaluationId} evaluation={evaluation} />
          ))}
        </ul>
      )}
    </section>
  )
}
