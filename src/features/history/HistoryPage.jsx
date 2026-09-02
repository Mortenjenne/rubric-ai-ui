import { Link } from 'react-router-dom'
import { getLabel } from '../../shared/storage/labels'
import { useEvaluations } from './useEvaluations'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { SuggestedGrade } from '../../shared/ui/SuggestedGrade'

function HistoryRow({ evaluation }) {
  const label = getLabel(evaluation.evaluationId)

  return (
    <li>
      <Link to={`/evaluations/${evaluation.evaluationId}`}>
        <time dateTime={evaluation.createdAt}>{evaluation.createdAt}</time>
        <p>{label ?? 'No label saved'}</p>
        <SuggestedGrade grade={evaluation.suggestedGrade} />
      </Link>
    </li>
  )
}

export function HistoryPage() {
  const { data: evaluations, isPending, isError, refetch } = useEvaluations()

  return (
    <section>
      <h1>History</h1>

      {isPending && <p role="status">Loading history…</p>}

      {isError && (
        <ErrorBox
          message="Evaluation history couldn't be loaded. You can try again."
          actionLabel="Retry"
          onAction={refetch}
        />
      )}

      {evaluations && evaluations.length === 0 && <p>No Evaluations yet.</p>}

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
