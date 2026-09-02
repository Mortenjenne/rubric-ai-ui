import { strings } from '../i18n/strings'

/**
 * Renders an Evaluation's Suggested grade, always labeled advisory — never as a decided mark.
 * Deliberately minimal markup so it fits both a compact History row and a full Evaluation panel.
 * @param {{ grade: { value: string, advisory: boolean } }} props
 */
export function SuggestedGrade({ grade }) {
  return (
    <p>
      <strong>{grade.value}</strong> <span>({strings.suggestedGrade.advisoryNote})</span>
    </p>
  )
}
