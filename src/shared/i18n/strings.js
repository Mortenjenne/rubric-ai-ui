/** Centralized Danish UI copy. This app has a single fixed locale — no i18n library, no
 *  switcher, no English fallback. Domain terms follow the Danish UI labels in CONTEXT.md. */
export const strings = {
  app: {
    name: 'Rubric AI',
  },
  sidebar: {
    ariaLabel: 'Hovednavigation',
    newSubmission: 'Ny indlevering',
    history: 'Historik',
    identity: 'Underviser',
  },
  common: {
    retry: 'Prøv igen',
  },
  theme: {
    switchToLight: 'Skift til lyst tema',
    switchToDark: 'Skift til mørkt tema',
  },
  upload: {
    heading: 'Indlevering',
    subheading: 'Indsend en indlevering til vurdering',
    instruction: 'Indsæt hele indleveringen nedenfor.',
    reportTextLabel: 'Indleveringstekst',
    textareaPlaceholder: 'Indsæt indleveringens tekst...',
    charCount: (count) => `${count} tegn`,
    fileLabel: 'Eller vælg en .md- eller .txt-fil',
    fileLoaded: (fileName) => `Fil indlæst: ${fileName}`,
    labelLabel: 'Mærkat',
    labelPlaceholder: 'f.eks. Anders Nielsen',
    labelHelp: "Denne mærkat gemmes kun i denne browser og sendes aldrig til backend'en.",
    submit: 'Indsend',
    submitting: 'Vurderer…',
    progressStatus:
      'Vurderer indleveringen — det tager 20 til 90 sekunder. Luk eller genindlæs ikke denne side.',
  },
  history: {
    heading: 'Historik',
    subheading: 'Tidligere vurderinger',
    loading: 'Indlæser vurderinger…',
    loadError: 'Historik kunne ikke indlæses. Du kan prøve igen.',
    emptyHeading: 'Ingen vurderinger endnu',
    emptyBody: 'Vurderinger vises her, når du har indsendt din første indlevering.',
    noLabel: 'Ingen mærkat',
    columnLabel: 'Mærkat',
    columnCreated: 'Oprettet',
    columnGrade: 'Foreslået karakter',
    searchLabel: 'Søg på mærkat',
    searchPlaceholder: 'Søg på mærkat…',
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
