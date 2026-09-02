import { strings } from '../../shared/i18n/strings'
import { Finding } from './Finding'
import styles from './EvaluationColumn.module.css'

/** @param {{ evaluation: object, label: string | undefined }} props */
export function EvaluationColumn({ evaluation, label }) {
  return (
    <div className={styles.column}>
      {label && (
        <p className={styles.label}>
          {strings.evaluation.labelPrefix}: {label}
        </p>
      )}

      <section>
        <h2>{strings.evaluation.overallAssessmentHeading}</h2>
        <p>{evaluation.overallAssessment}</p>
      </section>

      <section>
        <h2>{strings.evaluation.findingsHeading}</h2>
        {evaluation.findings.map((finding, index) => (
          <Finding key={finding.criterion} finding={finding} defaultOpen={index === 0} />
        ))}
      </section>

      <section>
        <h2>{strings.evaluation.dialogueQuestionsHeading}</h2>
        <ul>
          {evaluation.dialogueQuestions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
