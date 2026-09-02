import { strings } from '../i18n/strings'

/**
 * Renders an Evaluation's Suggested grade, always labeled advisory — never as a decided mark.
 * @param {{ grade: { value: string, advisory: boolean } }} props
 */
export function SuggestedGrade({ grade }) {
  return (
    <p>
      <strong>{grade.value}</strong> <em>({strings.suggestedGrade.advisoryNote})</em>
    </p>
  )
}
