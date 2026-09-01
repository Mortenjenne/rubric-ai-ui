import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ResultPage } from './ResultPage'
import { buildEvaluation } from '../../test/fixtures/evaluation'

function renderResult(evaluation) {
  return render(
    <MemoryRouter
      initialEntries={[
        { pathname: `/evaluations/${evaluation.evaluationId}`, state: { evaluation } },
      ]}
    >
      <Routes>
        <Route path="/evaluations/:evaluationId" element={<ResultPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ResultPage', () => {
  it('renders the overall assessment, one Finding per Criterion, the advisory grade, and dialogue questions', () => {
    const evaluation = buildEvaluation()
    renderResult(evaluation)

    expect(screen.getByText(evaluation.overallAssessment)).toBeInTheDocument()

    for (const finding of evaluation.findings) {
      expect(screen.getByText(finding.criterionName)).toBeInTheDocument()
      expect(screen.getByText(finding.level)).toBeInTheDocument()
      expect(screen.getByText(finding.strengths[0])).toBeInTheDocument()
      expect(screen.getByText(finding.weaknesses[0])).toBeInTheDocument()
      expect(screen.getByText(finding.improvements[0])).toBeInTheDocument()
      expect(screen.getByText(new RegExp(finding.evidence[0]))).toBeInTheDocument()
    }

    expect(screen.getByText(evaluation.suggestedGrade.value)).toBeInTheDocument()
    expect(screen.getByText(/advisory/i)).toBeInTheDocument()

    for (const question of evaluation.dialogueQuestions) {
      expect(screen.getByText(question)).toBeInTheDocument()
    }
  })

  it('never renders a Level as a number, and never renders the Suggested grade as a decided mark', () => {
    const evaluation = buildEvaluation()
    renderResult(evaluation)

    for (const finding of evaluation.findings) {
      expect(finding.level).toMatch(/Mangelfuldt|Acceptabelt|Tilfredsstillende|Udmærket/)
    }

    const advisoryNote = screen.getByText(/advisory/i)
    expect(advisoryNote.textContent).toMatch(/not a decided grade/i)
    expect(screen.queryByText(/final grade/i)).not.toBeInTheDocument()
  })

  it('shows the Label saved at upload time, keyed by evaluationId', () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-label-test' })
    localStorage.setItem('rubric-ai:labels', JSON.stringify({ 'eval-label-test': 'Anna' }))

    renderResult(evaluation)

    expect(screen.getByText(/Anna/)).toBeInTheDocument()
  })

  it('does not show a Label when none was saved for this evaluationId', () => {
    const evaluation = buildEvaluation({ evaluationId: 'eval-no-label' })

    renderResult(evaluation)

    expect(screen.queryByText(/^Label:/)).not.toBeInTheDocument()
  })
})
