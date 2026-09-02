import { strings } from '../i18n/strings'
import styles from './EvaluationLabel.module.css'

/** Renders the Educator's local-only Label for an Evaluation, when one was saved.
 * @param {{ label: string | undefined }} props */
export function EvaluationLabel({ label }) {
  if (!label) return null

  return (
    <p className={styles.label}>
      {strings.evaluation.labelPrefix}: {label}
    </p>
  )
}
