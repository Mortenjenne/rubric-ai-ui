import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Inbox, Loader, Search } from 'react-feather'
import { getLabel } from '../../shared/storage/labels'
import { useEvaluations } from './useEvaluations'
import { ErrorBox } from '../../shared/ui/ErrorBox'
import { SuggestedGrade } from '../../shared/ui/SuggestedGrade'
import { strings } from '../../shared/i18n/strings'
import styles from './HistoryPage.module.css'

function HistoryRow({ evaluation, label }) {
  return (
    <li>
      <Link to={`/evaluations/${evaluation.evaluationId}`} className={styles.row}>
        <span className={styles.cellLabel}>{label ?? strings.history.noLabel}</span>
        <time dateTime={evaluation.createdAt} className={styles.cellCreated}>
          {evaluation.createdAt}
        </time>
        <span className={styles.cellGrade}>
          <SuggestedGrade grade={evaluation.suggestedGrade} />
        </span>
        <ChevronRight aria-hidden="true" size={18} className={styles.rowChevron} />
      </Link>
    </li>
  )
}

function SkeletonRow() {
  return (
    <li className={styles.skeletonRow} aria-hidden="true">
      <span className={styles.skeletonBar} />
      <span className={styles.skeletonBar} />
      <span className={styles.skeletonBar} />
    </li>
  )
}

export function HistoryPage() {
  const { data: evaluations, isPending, isError, refetch } = useEvaluations()
  const [search, setSearch] = useState('')

  const rows = useMemo(
    () => (evaluations ?? []).map((evaluation) => ({
      evaluation,
      label: getLabel(evaluation.evaluationId),
    })),
    [evaluations],
  )

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return rows
    return rows.filter(({ label }) => (label ?? '').toLowerCase().includes(query))
  }, [rows, search])

  const hasEvaluations = Boolean(evaluations && evaluations.length > 0)

  return (
    <section>
      <h1>{strings.history.heading}</h1>
      <p>{strings.history.subheading}</p>

      {hasEvaluations && (
        <div className={styles.searchWrapper}>
          <Search aria-hidden="true" size={16} className={styles.searchIcon} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={strings.history.searchPlaceholder}
            aria-label={strings.history.searchLabel}
            className={styles.searchInput}
          />
        </div>
      )}

      {isPending && (
        <div className={styles.loadingState}>
          <p role="status" className={styles.loadingText}>
            <Loader aria-hidden="true" size={16} className="spin-icon" />
            {strings.history.loading}
          </p>
          <ul className={styles.list}>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </ul>
        </div>
      )}

      {isError && (
        <div className={styles.stateContainer}>
          <ErrorBox
            message={strings.history.loadError}
            actionLabel={strings.common.retry}
            onAction={refetch}
          />
        </div>
      )}

      {evaluations && evaluations.length === 0 && (
        <div className={styles.emptyState}>
          <Inbox aria-hidden="true" size={32} className={styles.emptyIcon} />
          <p className={styles.emptyHeading}>{strings.history.emptyHeading}</p>
          <p className={styles.emptyBody}>{strings.history.emptyBody}</p>
          <Link to="/" className={styles.emptyCta}>
            {strings.sidebar.newSubmission}
          </Link>
        </div>
      )}

      {hasEvaluations && (
        <>
          <div className={styles.headerRow} aria-hidden="true">
            <span>{strings.history.columnLabel}</span>
            <span>{strings.history.columnCreated}</span>
            <span>{strings.history.columnGrade}</span>
          </div>
          <ul className={styles.list}>
            {visibleRows.map(({ evaluation, label }) => (
              <HistoryRow key={evaluation.evaluationId} evaluation={evaluation} label={label} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
