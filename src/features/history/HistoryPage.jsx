import { Link } from 'react-router-dom'
import { ChevronRight, Inbox, Loader } from 'react-feather'
import { getLabel } from '../../shared/storage/labels'
import { useEvaluations } from './useEvaluations'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { SuggestedGrade } from '../../shared/ui/SuggestedGrade'
import { strings } from '../../shared/i18n/strings'
import styles from './HistoryPage.module.css'

function HistoryRow({ evaluation }) {
  const label = getLabel(evaluation.evaluationId)

  return (
    <li>
      <Link to={`/evaluations/${evaluation.evaluationId}`} className={styles.row}>
        <span className={styles.rowContent}>
          <time dateTime={evaluation.createdAt}>{evaluation.createdAt}</time>
          <p>{label ?? strings.history.noLabel}</p>
          <SuggestedGrade grade={evaluation.suggestedGrade} />
        </span>
        <ChevronRight aria-hidden="true" size={18} className={styles.rowChevron} />
      </Link>
    </li>
  )
}

export function HistoryPage() {
  const { data: evaluations, isPending, isError, refetch } = useEvaluations()

  return (
    <section>
      <h1>{strings.history.heading}</h1>

      {isPending && (
        <p role="status" className={styles.loading}>
          <Loader aria-hidden="true" size={16} className="spin-icon" />
          {strings.history.loading}
        </p>
      )}

      {isError && (
        <ErrorBox
          message={strings.history.loadError}
          actionLabel={strings.common.retry}
          onAction={refetch}
        />
      )}

      {evaluations && evaluations.length === 0 && (
        <p className={styles.empty}>
          <Inbox aria-hidden="true" size={20} />
          {strings.history.empty}
        </p>
      )}

      {evaluations && evaluations.length > 0 && (
        <ul className={styles.list}>
          {evaluations.map((evaluation) => (
            <HistoryRow key={evaluation.evaluationId} evaluation={evaluation} />
          ))}
        </ul>
      )}
    </section>
  )
}
