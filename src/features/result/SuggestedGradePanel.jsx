import { strings } from '../../shared/i18n/strings'
import { SuggestedGrade } from '../../shared/ui/SuggestedGrade'
import styles from './SuggestedGradePanel.module.css'

/** The Evaluation page's advisory Suggested grade panel (docs/design.md §17) — a card wrapper
 * around the shared, minimal SuggestedGrade so History's compact row rendering stays untouched.
 * @param {{ grade: { value: string, advisory: boolean } }} props */
export function SuggestedGradePanel({ grade }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>{strings.evaluation.suggestedGradeHeading}</h2>
      <SuggestedGrade grade={grade} />
    </div>
  )
}
