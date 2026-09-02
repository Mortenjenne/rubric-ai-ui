/** Centralized Danish UI copy. This app has a single fixed locale — no i18n library, no
 *  switcher, no English fallback. Domain terms follow the Danish UI labels in CONTEXT.md. */
export const strings = {
  sidebar: {
    ariaLabel: 'Hovednavigation',
    newSubmission: 'Ny indlevering',
    history: 'Historik',
    identity: 'Underviser',
  },
  common: {
    retry: 'Prøv igen',
  },
  upload: {
    heading: 'Indlevering',
    reportTextLabel: 'Indleveringstekst',
    fileLabel: 'Eller vælg en .md- eller .txt-fil',
    labelLabel: 'Mærkat (valgfrit)',
    submit: 'Indsend',
    submitting: 'Vurderer…',
    progressStatus:
      'Vurderer indleveringen — det tager 20 til 90 sekunder. Luk eller genindlæs ikke denne side.',
  },
  history: {
    heading: 'Historik',
    loading: 'Indlæser historik…',
    loadError: 'Vurderingshistorikken kunne ikke indlæses. Du kan prøve igen.',
    empty: 'Ingen vurderinger endnu.',
    noLabel: 'Ingen mærkat gemt',
  },
  evaluation: {
    heading: 'Vurdering',
    loading: 'Indlæser vurdering…',
    loadingBody: 'Henter vurderingen…',
    notFound: (evaluationId) => `Der findes ingen vurdering med id ${evaluationId}.`,
    loadError: 'Denne vurdering kunne ikke indlæses. Du kan prøve igen.',
    labelPrefix: 'Mærkat',
    overallAssessmentHeading: 'Samlet vurdering',
    suggestedGradeHeading: 'Foreslået karakter',
    findingsHeading: 'Fund',
    strengths: 'Styrker',
    weaknesses: 'Svagheder',
    improvements: 'Forbedringspunkter',
    evidence: 'Evidens',
    dialogueQuestionsHeading: 'Dialogspørgsmål',
    submissionHeading: 'Indlevering',
  },
  suggestedGrade: {
    advisoryNote: 'vejledende — et udgangspunkt, ikke en endelig karakter',
  },
  errors: {
    invalidModelOutput:
      'Vurderingen kunne ikke gennemføres, fordi modellens svar ikke kunne valideres. Du kan prøve igen.',
    rateLimited: 'AI-udbyderen begrænser antallet af forespørgsler lige nu. Prøv igen om et øjeblik.',
    upstreamUnavailable:
      'AI-udbyderen kan ikke kontaktes lige nu. Prøv igen, når den er tilgængelig igen.',
    configurationError:
      'Der er et konfigurationsproblem med denne tjeneste. Kontakt support — at prøve igen løser det ikke.',
    generic: 'Der opstod en fejl under vurderingen af denne indlevering. Du kan prøve igen.',
  },
}
