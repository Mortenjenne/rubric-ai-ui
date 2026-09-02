import { strings } from '../../shared/i18n/strings'
import styles from './Finding.module.css'

function ListSection({ title, items }) {
  return (
    <>
      <h4 className={styles.listHeading}>{title}</h4>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  )
}

function Evidence({ items }) {
  return (
    <>
      <h4 className={styles.listHeading}>{strings.evaluation.evidence}</h4>
      <ul className={styles.evidenceList}>
        {items.map((item, index) => (
          <li key={index} className={styles.evidenceQuote}>
            &ldquo;{item}&rdquo;
          </li>
        ))}
      </ul>
    </>
  )
}

/** @param {{ finding: object, defaultOpen: boolean }} props */
export function Finding({ finding, defaultOpen }) {
  return (
    <details className={styles.finding} open={defaultOpen}>
      <summary className={styles.summary}>
        <span className={styles.criterionName}>{finding.criterionName}</span>
        <span className={styles.levelBadge}>{finding.level}</span>
      </summary>

      <div className={styles.body}>
        <ListSection title={strings.evaluation.strengths} items={finding.strengths} />
        <ListSection title={strings.evaluation.weaknesses} items={finding.weaknesses} />
        <ListSection title={strings.evaluation.improvements} items={finding.improvements} />
        <Evidence items={finding.evidence} />
      </div>
    </details>
  )
}
