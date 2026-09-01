/** @param {object} [overrides] @returns {object} a full Evaluation matching the POST /api/evaluations contract */
export function buildEvaluation(overrides = {}) {
  return {
    evaluationId: 'eval-1',
    rubricVersion: 1,
    provider: 'openai',
    model: 'gpt-4o-mini',
    createdAt: '2026-08-31T09:14:22.531Z',
    overallAssessment:
      'Rapporten giver et solidt første indtryk med konkrete eksempler fra praktikken.',
    suggestedGrade: {
      value: '10',
      advisory: true,
    },
    findings: [
      {
        criterion: 'formkrav',
        criterionName: 'Formkrav & begrænsninger',
        weight: 10,
        level: 'Tilfredsstillende',
        strengths: ['Rapporten er velstruktureret.'],
        weaknesses: ['Et enkelt afsnit mangler et konkret eksempel.'],
        improvements: ['Tilføj en kort beskrivelse af evalueringsskemaet.'],
        evidence: [
          'Jeg brugte C# og React til at bygge en intern rapporteringsløsning til virksomheden.',
        ],
      },
      {
        criterion: 'metode',
        criterionName: 'Metode & fremgangsmåde',
        weight: 20,
        level: 'Udmærket',
        strengths: ['Metodevalget er velbegrundet.'],
        weaknesses: ['Alternative metoder diskuteres ikke.'],
        improvements: ['Overvej at inddrage en kort metodediskussion.'],
        evidence: ['Praktikvirksomheden er et mellemstort IT-konsulenthus med afdelinger i tre byer.'],
      },
    ],
    dialogueQuestions: [
      'Hvordan besluttede I jer for at bruge React frem for et andet framework?',
      'Hvad ville du gøre anderledes, hvis du skulle løse opgaven igen?',
      'Hvordan påvirkede samarbejdet med kunden dine tekniske valg?',
      'Hvad tager du med dig videre fra praktikken?',
    ],
    ...overrides,
  }
}
