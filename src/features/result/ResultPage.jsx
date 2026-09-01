import { useParams } from 'react-router-dom'

export function ResultPage() {
  const { evaluationId } = useParams()

  return (
    <section>
      <h1>Result</h1>
      <p>Evaluation {evaluationId}</p>
    </section>
  )
}
