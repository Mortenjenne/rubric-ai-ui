import { strings } from '../../shared/i18n/strings'
import styles from './SubmissionPanel.module.css'

/** @param {{ submissionText: string, label: string | undefined }} props */
export function SubmissionPanel({ submissionText, label }) {
  return (
    <aside className={styles.panel} data-testid="submission-panel">
      {label && (
        <p className={styles.label}>
          {strings.evaluation.labelPrefix}: {label}
        </p>
      )}

      <h2 className={styles.heading}>{strings.evaluation.submissionHeading}</h2>
      <p className={styles.text}>{submissionText}</p>
    </aside>
  )
}
