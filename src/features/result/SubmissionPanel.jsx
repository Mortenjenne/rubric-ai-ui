import { strings } from '../../shared/i18n/strings'
import { EvaluationLabel } from '../../shared/ui/EvaluationLabel'
import styles from './SubmissionPanel.module.css'

/** @param {{ submissionText: string, label: string | undefined }} props */
export function SubmissionPanel({ submissionText, label }) {
  return (
    <aside className={styles.panel} data-testid="submission-panel">
      <EvaluationLabel label={label} />

      <h2 className={styles.heading}>{strings.evaluation.submissionHeading}</h2>
      <p className={styles.text}>{submissionText}</p>
    </aside>
  )
}
