import { expect } from 'vitest'
import { screen } from '@testing-library/react'

/** Asserts the Result view landed on the given Evaluation: overall assessment, one Finding
 *  per Criterion (name + Level), the advisory Suggested grade, and the dialogue questions. */
export function expectResultLanded(evaluation) {
  expect(screen.getByText(evaluation.overallAssessment)).toBeInTheDocument()

  for (const finding of evaluation.findings) {
    expect(screen.getByText(finding.criterionName)).toBeInTheDocument()
    expect(screen.getByText(finding.level)).toBeInTheDocument()
  }

  expect(screen.getByText(evaluation.suggestedGrade.value)).toBeInTheDocument()
  expect(screen.getByText(/advisory/i)).toBeInTheDocument()

  for (const question of evaluation.dialogueQuestions) {
    expect(screen.getByText(question)).toBeInTheDocument()
  }
}
