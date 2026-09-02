import { strings } from '../i18n/strings'
import styles from './SuggestedGrade.module.css'

/**
 * Renders an Evaluation's Suggested grade, always labeled advisory — never as a decided mark.
 * @param {{ grade: { value: string, advisory: boolean } }} props
 */
export function SuggestedGrade({ grade }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>{strings.evaluation.suggestedGradeHeading}</h2>
      <p className={styles.value}>{grade.value}</p>
      <p className={styles.advisoryNote}>({strings.suggestedGrade.advisoryNote})</p>
    </div>
  )
}
