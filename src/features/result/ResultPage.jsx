import { useLocation, useParams } from 'react-router-dom'
import { getLabel } from '../../shared/storage/labels'

function ListSection({ title, items }) {
  return (
    <>
      <h4>{title}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  )
}

export function ResultPage() {
  const { evaluationId } = useParams()
  const location = useLocation()
  const evaluation = location.state?.evaluation

  if (!evaluation) {
    return (
      <section>
        <h1>Evaluation</h1>
        <p>Evaluation {evaluationId}</p>
      </section>
    )
  }

  const label = getLabel(evaluation.evaluationId)

  return (
    <section>
      <h1>Evaluation</h1>
      {label && <p>Label: {label}</p>}

      <p>{evaluation.overallAssessment}</p>

      <section>
        <h2>Suggested grade</h2>
        <p>
          <strong>{evaluation.suggestedGrade.value}</strong>{' '}
          <em>(advisory — a starting point, not a decided grade)</em>
        </p>
      </section>

      <section>
        <h2>Findings</h2>
        {evaluation.findings.map((finding) => (
          <article key={finding.criterion}>
            <h3>{finding.criterionName}</h3>
            <p>
              Level: <strong>{finding.level}</strong>
            </p>

            <ListSection title="Strengths" items={finding.strengths} />
            <ListSection title="Weaknesses" items={finding.weaknesses} />
            <ListSection title="Improvements" items={finding.improvements} />

            <h4>Evidence</h4>
            <ul>
              {finding.evidence.map((item, index) => (
                <li key={index}>&ldquo;{item}&rdquo;</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>Dialogue questions</h2>
        <ul>
          {evaluation.dialogueQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}
