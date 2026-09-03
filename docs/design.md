Rubric AI — Frontend Design

1. Purpose

Rubric AI is an internal frontend used only by Educators to submit a Submission, inspect the backend's advisory Evaluation, and revisit past Evaluations.

The design should support the workflow:

Submission → Evaluation → Educator judgement

The UI must make it clear that Rubric AI provides an advisory Evaluation. The Educator remains responsible for the actual grading decision.

This document describes the UI direction after the MVP implementation tickets. It is a design specification, not a new feature scope. It is worked one ticket at a time (see `.scratch/rubric-ai-mvp/issues/`), the same way tickets 01–05 shipped, not as a single redesign PR.

2. Product vocabulary

Use the domain vocabulary consistently. The canonical English term, its Danish UI label, and both languages' avoid-lists are recorded in [`CONTEXT.md`](../CONTEXT.md) — that file is the single source of truth for terminology; do not duplicate or re-derive translations here, to avoid the two documents drifting apart.

The route `/evaluations/:evaluationId` may remain an implementation route, but the visible UI should use the Evaluation's Danish label ("Vurdering"), not "Result".

3. Design principles

3.1 Evaluation first

The most important screen is the Evaluation view. The interface should help an Educator quickly understand:

What was evaluated?

What is the overall assessment?

What did the Evaluation find for each Criterion?

What evidence supports each Finding?

What Suggested grade did Rubric AI provide?

What questions could support a follow-up dialogue?

3.2 Advisory, never authoritative

The UI must continuously distinguish AI advice from the Educator's own judgement.

Suggested grade should be presented as:

Foreslået karakter
7
Vejledende — et udgangspunkt for din egen vurdering.

Never make it look like a final or decided mark.

3.3 Levels are qualitative

Levels are quality names, not grades or scores.

Never represent them with:

numbers

percentages

stars

progress bars

ranked colors

traffic-light colors

Use neutral typography or a neutral badge.

Example:

[ Tilfredsstillende ]

3.4 Evidence deserves emphasis

Evidence is particularly useful because it connects a Finding to the Submission.

Evidence should look like quoted source material rather than another generic paragraph.

Example:

„Praktikken var struktureret omkring tre hovedopgaver...“

3.5 Calm internal tool

The visual language should feel like a professional workspace rather than an AI marketing product.

Prefer:

neutral surfaces

subtle borders

restrained shadows

strong typography hierarchy

generous whitespace

compact navigation

clear actions

predictable interaction

Avoid:

AI gradients

decorative animations

dashboards full of metrics

unnecessary charts

gamification

visual score meters

4. Application structure

The MVP has three primary routes:

/
├── Ny indlevering

/evaluations/:evaluationId
├── Vurdering

/history
└── Historik

The default route is /.

Navigation to the Ny indlevering and Historik views should always be available.

5. Global shell

Desktop:

┌──────────────────────┬────────────────────────────────────────────────────┐
│ Rubric AI            │                              Underviser  ◐         │
├──────────────────────┼────────────────────────────────────────────────────┤
│  + Ny indlevering    │                                                    │
│                      │                    SIDE                           │
│  Historik            │                                                    │
│                      │                                                    │
│                      │                                                    │
│                      │                                                    │
│                      │                                                    │
└──────────────────────┴────────────────────────────────────────────────────┘

The header spans the full width, above both the sidebar and the content — not just above the
content column. "Rubric AI" sits in the segment directly over the sidebar; the Underviser identity
and the light/dark theme toggle sit together on the header's right, over the content column. The
sidebar itself is navigation only below the header — it does not repeat the name or identity, and
has no footer.

Sidebar

Primary actions:

+ Ny indlevering

Historik

Do not introduce login/account UI. Authentication is explicitly out of scope.

Note on nav items: "Ny indlevering" and "Historik" are the only two primary items. There is no
separate "Evaluations" list — a row in Historik and the page reached after submitting are the same
Evaluation view, not two different collections.

6. Page: Ny indlevering

This is the primary landing experience.

Wireframe

┌─────────────────────────────────────────────────────────────────────┐
│ Ny indlevering                                                        │
│                                                                       │
│ Indsend en indlevering til vurdering                                  │
│                                                                       │
│ Indsæt hele indleveringen nedenfor.                                   │
│                                                                       │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │                                                                   │ │
│ │ Indsæt indleveringens tekst...                                    │ │
│ │                                                                   │ │
│ │                                                                   │ │
│ │                                                                   │ │
│ │                                                                   │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ 0 tegn                                                                │
│                                                                       │
│ Mærkat                                                                │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ f.eks. Anders Nielsen                                             │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ Denne mærkat gemmes kun i denne browser og sendes aldrig til          │
│ backend'en.                                                          │
│                                                                       │
│                           [ Vurdér indlevering ]                     │
└─────────────────────────────────────────────────────────────────────┘

Submission input

Use one large textarea.

The .md / .txt file picker should be a secondary action associated with the textarea, for example:

Vælg .md- eller .txt-fil

The selected file is read client-side and populates the same textarea. There should not be a separate file-based workflow.

Do not introduce PDF or .docx UI.

Label

Label is optional.

It should be visually described as local browser information.

The backend must never receive the Label.

7. Ny indlevering — states

Empty

Indlevering

┌──────────────────────────────────────────────────────────┐
│ Indsæt indleveringens tekst...                            │
│                                                            │
└──────────────────────────────────────────────────────────┘

Mærkat

┌──────────────────────────────────────────────────────────┐
│ Valgfri                                                    │
└──────────────────────────────────────────────────────────┘

                         [ Vurdér indlevering ]

The primary action is disabled until non-whitespace Submission text exists.

Validation error

Indlevering

┌──────────────────────────────────────────────────────────┐
│                                                            │
└──────────────────────────────────────────────────────────┘
Indtast venligst en indlevering, før du vurderer den.

                         [ Vurdér indlevering ]

No request is sent for blank or whitespace-only text.

File selection

After selecting .md or .txt:

Indlevering

┌──────────────────────────────────────────────────────────┐
│ Indhold fra den valgte fil...                             │
│                                                            │
└──────────────────────────────────────────────────────────┘

Fil indlæst: internship.md

                         [ Vurdér indlevering ]

The file name is optional supporting feedback; the textarea remains the source of truth.

8. Submission in-flight state

The backend can take 20–90 seconds and has a hard 90-second timeout.

The interface must explain the wait instead of appearing frozen.

┌──────────────────────────────────────────────────────────┐
│                                                            │
│ Vurderer indleveringen                                    │
│                                                            │
│ Rubric AI vurderer indleveringen. Dette kan tage           │
│ 20–90 sekunder.                                            │
│                                                            │
└──────────────────────────────────────────────────────────┘

                         [ Vurderer... ]

Do not show a fake percentage or fake progress indicator.

The submit button remains disabled for the duration of the request.

A beforeunload warning protects against accidental browser reload/close while the request is pending.

This is a warning only; it is not a resume mechanism.

9. Evaluation page

The Evaluation page is the core product experience.

Submission text is never persisted by the backend (see ADR 0003) — it only exists in memory in the
immediate post-submit render. Every other entry path (a History click-through, a direct link, a
reload) has no Submission text to show. So the **default** structure is two columns, and the
Submission column is a conditional addition, not the baseline.

Default desktop structure (two columns — this is what renders on every entry path except an
immediate post-submit render):

┌────────────────────────────────────────┬───────────────┐
│ Vurdering                               │ Vejledende    │
│                                          │               │
│ Samlet vurdering                        │ Foreslået     │
│                                          │ karakter      │
│ Fritekst vurdering...                   │               │
│                                          │       7       │
│                                          │   Vejledende  │
│ ──────────────────────────────────────  │               │
│                                          │ Et udgangs-   │
│ Formkrav & begrænsninger                │ punkt for din │
│                                          │ egen vurdering│
│ [ Tilfredsstillende ]                   │               │
│                                          │               │
│ Styrker                                 │               │
│ • ...                                   │               │
│                                          │               │
│ Svagheder                               │               │
│ • ...                                   │               │
│                                          │               │
│ Forbedringer                            │               │
│ • ...                                   │               │
│                                          │               │
│ Belæg                                   │               │
│ „Ordret citat...“                       │               │
│                                          │               │
│ Faglig refleksion                     ▾ │               │
└────────────────────────────────────────┴───────────────┘

Three-column variant (Submission column added), immediate post-submit render only, since the text
is still available in memory:

┌───────────────────┬──────────────────────────────────────┬───────────────┐
│ Indlevering        │ Vurdering                            │ Vejledende    │
│                    │                                      │               │
│ Mærkat             │ Samlet vurdering                     │ Foreslået     │
│ Anders Nielsen     │                                      │ karakter      │
│                    │ Fritekst vurdering...                │               │
│ ────────────────   │                                      │       7       │
│                    │                                      │   Vejledende  │
│ Indlevering        │ ──────────────────────────────────── │               │
│                    │                                      │ Et udgangs-   │
│ Lorem ipsum...     │ Formkrav & begrænsninger              │ punkt for din │
│                    │                                      │ egen vurdering│
│ Lorem ipsum...     │ [ Tilfredsstillende ]                │               │
│                    │                                      │               │
│                    │ Styrker                              │               │
│                    │ • ...                                │               │
│                    │                                      │               │
│                    │ Svagheder                             │               │
│                    │ • ...                                │               │
│                    │                                      │               │
│                    │ Forbedringer                          │               │
│                    │ • ...                                │               │
│                    │                                      │               │
│                    │ Belæg                                 │               │
│                    │ „Ordret citat...“                    │               │
│                    │                                      │               │
│                    │ Faglig refleksion                  ▾ │               │
└───────────────────┴──────────────────────────────────────┴───────────────┘

The exact column widths can adapt to the viewport. The conceptual hierarchy is more important than fixed dimensions.

10. Evaluation header

At the top:

← Tilbage

Vurdering

Mærkat: Anders Nielsen
Vurderet 2. sep. 2026 kl. 14.32

The Label should only appear when one exists in localStorage.

Do not call the Label a student name.

11. Submission panel

This panel is optional context, present only in the three-column variant from §9 — the immediate
post-submit render, where Submission text still exists in memory.

Indlevering

Mærkat
Anders Nielsen

────────────────────────

Indlevering

Lorem ipsum dolor sit amet...

Lorem ipsum dolor sit amet...

Lorem ipsum dolor sit amet...

The Submission is not persisted by the backend — see ADR 0003. On every entry path other than the
immediate post-submit render, this panel is simply absent and the page uses the default
two-column layout from §9, not an empty/placeholder version of this panel.

The design should avoid suggesting that the Label is server-side identity.

12. Overall assessment

Place the overall assessment before the individual Findings.

Samlet vurdering
────────────────────────────────────────

Indleveringen viser en tydelig forståelse af praktikforløbet
og berører de fleste af de påkrævede elementer.

Refleksionen kunne være mere specifik omkring...

This provides the Educator with a quick reading before entering Criterion-level detail.

13. Findings

There must be exactly one Finding per Criterion, displayed in Rubric order.

Recommended structure:

┌───────────────────────────────────────────────────────────────┐
│ Formkrav & begrænsninger                                       │
│                                                                 │
│ [ Tilfredsstillende ]                                           │
│                                                                 │
│ Styrker                                                         │
│ • Indleveringen opfylder de påkrævede formkrav.                 │
│ • Begrænsningerne er tydeligt beskrevet.                        │
│                                                                 │
│ Svagheder                                                       │
│ • Et krav er kun delvist opfyldt.                               │
│                                                                 │
│ Forbedringer                                                    │
│ • Forklar hvordan begrænsningen påvirkede resultatet.           │
│                                                                 │
│ Belæg                                                           │
│                                                                 │
│ │ „Praktikken var struktureret omkring tre hovedopgaver…“       │
└───────────────────────────────────────────────────────────────┘

Each Finding should have clear internal hierarchy.

Recommended order:

Kriterium

Niveau

Styrker

Svagheder

Forbedringer

Belæg

14. Findings with many Criteria

To avoid excessive vertical density, Findings can be collapsible.

Collapsed:

Formkrav & begrænsninger
[ Tilfredsstillende ]                                      ▾

Faglig refleksion
[ Udmærket ]                                                ›

Praktisk anvendelse
[ Acceptabelt ]                                             ›

Expanded:

Formkrav & begrænsninger
[ Tilfredsstillende ]                                       ↑

Styrker
...

Svagheder
...

Forbedringer
...

Belæg
...

The first Finding may be expanded by default. If the Evaluation is short, all Findings may remain expanded.

15. Level presentation

Levels should be neutral and textual.

Allowed:

[ Mangelfuldt ]
[ Acceptabelt ]
[ Tilfredsstillende ]
[ Udmærket ]

Also acceptable:

Niveau

Tilfredsstillende

Never use:

★★★★☆
85%
████████░░
Score: 3
🔴 🟡 🟢

The visual treatment must not imply that a Level is a numeric score or color-ranked scale.

16. Evidence presentation

Evidence should be visually identifiable as a quote from the Submission.

Recommended:

Belæg

│ „Praktikken var struktureret omkring tre hovedopgaver…“

Use a subtle border, indentation, quotation styling, or a slightly different surface.

Do not turn evidence into a score or confidence indicator.

Do not add invented evidence.

17. Suggested grade panel

The Suggested grade should be visible but clearly secondary to the Educator's judgement.

┌─────────────────────────────┐
│ Foreslået karakter           │
│                              │
│              7               │
│                              │
│          Vejledende          │
│                              │
│ Et udgangspunkt for din      │
│ egen vurdering.              │
└─────────────────────────────┘

The wording should explicitly communicate that it is advisory.

Never display:

Endelig karakter

Facit

Karakter (alene)

Score

Rating

Verdict

as the primary label for this value.

The numeric value itself is valid because Suggested grade is defined on the 7-trins-skala. The restriction applies to Levels, not to the Suggested grade.

18. Dialogue questions

Place dialogue questions after the Findings.

Opfølgende spørgsmål
────────────────────────────────────────

Rubric AI foreslår at drøfte:

1. Hvordan ændrede praktikforløbet din forståelse
   af faget?

2. Kan du give et konkret eksempel på...?

3. Hvad ville du gøre anderledes...?

If none are returned:

Opfølgende spørgsmål

Der blev ikke foreslået opfølgende spørgsmål til
denne vurdering.

These are conversation prompts, not grading criteria.

19. Evaluation loading state

For a direct URL/reload where the Evaluation is not already available in memory:

Vurdering

                    ◌

              Indlæser vurdering

        Henter vurderingen...

Keep the page calm and simple.

Do not show a fake progress percentage.

20. Evaluation not found

For an unresolvable 404 evaluation_not_found or malformed 400 identifier:

Vurdering

Vurderingen blev ikke fundet

Vurderingen kunne ikke findes.

[ Tilbage til historik ]

Do not offer Retry for an identifier that cannot be resolved by retrying. Adding the "Tilbage til
historik" action is new relative to what ticket 04 shipped (today's not-found state has no button)
— treat it as its own small ticket, not something to slip in silently alongside an unrelated change.

21. Evaluation fetch error

For other GET failures:

┌─────────────────────────────────────────────────────────────┐
│ Vurderingen kunne ikke indlæses                               │
│                                                                 │
│ Vi kunne ikke hente denne vurdering. Prøv venligst igen.       │
│                                                                 │
│ [ Prøv igen ]                                                   │
└─────────────────────────────────────────────────────────────┘

Use the shared ErrorBox pattern.

Never render raw JSON, error.message, backend codes, or HTTP status codes.

22. Upload error states

Errors from POST /api/evaluations are inline and non-blocking.

The form remains usable.

Recommended location:

Indlevering
┌──────────────────────────────────────────────────────────┐
│ ...                                                        │
└──────────────────────────────────────────────────────────┘

Mærkat
┌──────────────────────────────────────────────────────────┐
│ Anders Nielsen                                             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Vurderingen kunne ikke gennemføres.                        │
│ Prøv venligst igen.                                        │
│                                                              │
│ [ Prøv igen ]                                               │
└──────────────────────────────────────────────────────────┘

                         [ Vurdér indlevering ]

The error box uses role="alert".

23. Retryable error copy

The three retryable failure types need distinct, plain-language copy. Illustrative Danish concepts
below — the canonical strings that actually ship live in the frontend's centralized strings module
(see ticket 06, `.scratch/rubric-ai-mvp/issues/06-translate-ui-to-danish.md`), not here, so this
section doesn't drift out of sync with the real copy the way the History row fields once did.

invalid_model_output

Concept:

Vi kunne ikke danne en pålidelig vurdering. Prøv venligst igen.

Action:

Prøv igen

rate_limited

Concept:

Tjenesten er midlertidigt overbelastet. Prøv venligst igen om lidt.

Action:

Prøv igen

upstream_unavailable

Concept:

Vurderingstjenesten er midlertidigt utilgængelig. Prøv venligst igen.

Action:

Prøv igen

24. Configuration error

This error should be framed as a service problem.

┌──────────────────────────────────────────────────────────┐
│ Vurdering utilgængelig                                     │
│                                                              │
│ Rubric AI er ikke korrekt konfigureret. Kontakt venligst   │
│ support i stedet for at prøve igen.                        │
│                                                              │
│ [ Kontakt support ]                                          │
└──────────────────────────────────────────────────────────┘

No Retry action.

25. Retry behavior

Retry must always be explicit.

Fejl
  ↓
Underviseren klikker på "Prøv igen"
  ↓
samme indleveringstekst
  ↓
POST /api/evaluations

Never automatically retry after a failure.

The textarea and Label remain editable while an error is visible.

26. History

History is the second major workflow after Evaluation.

Desktop:

┌─────────────────────────────────────────────────────────────────────┐
│ Historik                                                             │
│                                                                       │
│ Tidligere vurderinger                                                │
│                                                                       │
│ ┌───────────────────────────────────────────────────────────────┐   │
│ │ Søg på mærkat...                                                │   │
│ └───────────────────────────────────────────────────────────────┘   │
│                                                                       │
│ Mærkat              Oprettet              Foreslået karakter         │
│ ────────────────────────────────────────────────────────────────── │
│ Anders Nielsen      2. sep. 2026          7 · Vejledende             │
│ Maria Jensen        1. sep. 2026         10 · Vejledende             │
│ Jonas Hansen        29. aug. 2026         4 · Vejledende             │
└─────────────────────────────────────────────────────────────────────┘

Each row represents one Evaluation.

Show:

Label, when available

Created timestamp

Suggested grade with explicit advisory framing

Overall assessment is deliberately NOT shown here — it is not part of the GET /api/evaluations row
contract documented in `docs/api/api.md` (that endpoint returns `evaluationId`, `rubricVersion`,
`provider`, `model`, `createdAt` and `suggestedGrade` only). Fetch the overall assessment, along
with findings and dialogue questions, only after navigating into a row via GET /api/evaluations/{id}.

Rows should be clickable.

Clicking a row navigates to:

/evaluations/:evaluationId

and lands on the same Evaluation view used after submission.

27. History loading

Historik

Tidligere vurderinger

┌───────────────────────────────────────────────────────────────┐
│ Indlæser vurderinger...                                        │
│                                                                 │
│ ███████████████████████████████████████████████████████████ │
│ ███████████████████████████████████████████████████████████ │
│ ███████████████████████████████████████████████████████████ │
└───────────────────────────────────────────────────────────────┘

Skeleton rows are acceptable.

Do not invent Evaluation content while loading.

28. History empty state

Historik

                 Ingen vurderinger endnu

     Vurderinger vises her, når du har indsendt
     din første indlevering.

                 [ Ny indlevering ]

29. History with missing Label

A missing Label must not produce an ugly blank cell.

Possible fallback:

—

or:

Ingen mærkat

"Ingen mærkat" is preferable if the table needs clear semantic meaning.

Do not invent a student identity.

30. History error state

Historik

┌───────────────────────────────────────────────────────────────┐
│ Historik kunne ikke indlæses                                   │
│                                                                 │
│ Vi kunne ikke hente vurderingerne. Prøv venligst igen.         │
│                                                                 │
│ [ Prøv igen ]                                                   │
└───────────────────────────────────────────────────────────────┘

No raw API error details.

31. History row interaction

Rows should communicate that they are navigable.

Example:

Anders Nielsen
2. sep. 2026 · 14.32
Foreslået karakter: 7 · Vejledende                     →

On hover/focus:

subtle surface change

clear focus ring

no dramatic animation

Keyboard interaction should be supported if rows behave as interactive controls.

32. No authentication UI

MVP has no authentication.

Do not design:

login

sign-up

account provisioning

Educator switching

profile management

per-Educator History filters

History is currently a single shared, unscoped list.

33. Responsive behavior

Desktop

Two-column Evaluation workspace by default (see §9):

Vurdering | Vejledende

Three columns only in the immediate post-submit render, adding Indlevering as the left column.

Tablet

Two-column or stacked layout:

Vurdering
Foreslået karakter

Samlet vurdering
Fund
Opfølgende spørgsmål

(Indlevering, when present, collapses behind a disclosure/drawer rather than taking a column.)

Mobile

Use a single-column layout.

Suggested grade should move near the top of the Evaluation, while retaining advisory framing.

Indlevering, on the rare render where it's present, can be collapsed behind a disclosure/drawer if necessary to preserve focus on the Evaluation.

Navigation can collapse into a mobile menu.

34. Accessibility

Required behavior:

visible keyboard focus states

semantic headings

labels for form controls

role="alert" for inline submission errors

buttons with clear action names

interactive History rows accessible by keyboard

sufficient text contrast

no meaning communicated by color alone

loading states understandable without animation

advisory status communicated through text, not color alone

Especially important:

Level meaning must never depend on color.

35. Component direction

Keep components aligned with the existing feature-folder architecture — matched here to what's
already shipped rather than a fresh naming scheme, so this section doesn't drift from the code the
way §26/§36 once did.

Shared UI primitives:

src/shared/ui/
├── ErrorBox
├── SuggestedGrade
├── Button
├── Badge
├── EmptyState
├── LoadingState
├── PageHeader
└── ...

Upload feature:

src/features/upload/
├── UploadPage
├── SubmissionForm
├── FilePicker
├── useCreateEvaluation
└── ...

Evaluation feature:

src/features/result/
├── ResultPage
├── EvaluationView
├── OverallAssessment
├── Finding
├── Evidence
├── DialogueQuestions
├── useEvaluation
└── ...

History feature:

src/features/history/
├── HistoryPage
├── HistoryRow
├── useEvaluations
└── ...

The route/component naming may remain result internally for compatibility with the existing implementation, but visible product terminology should say Vurdering (Evaluation), not Result.

36. Data and UI boundaries

The design must respect the existing API architecture.

POST

Request remains:

{ submissionText }

Do not add Label or student identity.

GET list

History receives lightweight rows, per the documented `docs/api/api.md` contract:

evaluationId
rubricVersion
provider
model
createdAt
suggestedGrade

No overallAssessment — see §26. Label is joined locally from localStorage.

GET by ID

The full Evaluation object (including overallAssessment, findings and dialogueQuestions) is used
for the Evaluation view.

Label

Local-only:

localStorage
  evaluationId → Label

Never send it to the backend.

37. Important design constraints

Do not add UI for functionality explicitly out of scope:

Rubric reference

Level descriptions

Active Rubric selection

PDF upload

.docx conversion

Authentication

accounts

per-Educator History

pagination

backend submission identity

The UI should not imply that any of these capabilities exist.

38. Visual hierarchy summary

The intended hierarchy is:

1. Vurdering
   │
   ├── Samlet vurdering
   │
   ├── Fund
   │    ├── Kriterium
   │    ├── Niveau
   │    ├── Styrker
   │    ├── Svagheder
   │    ├── Forbedringer
   │    └── Belæg
   │
   ├── Opfølgende spørgsmål
   │
   └── Foreslået karakter
        └── Vejledende

Suggested grade should be prominent enough to find, but never visually positioned as the Educator's final decision.

39. Design acceptance checklist

Before considering the visual design complete:

Upload is the default landing experience.

Educator can clearly paste a Submission.

.md and .txt are presented as alternative ways to populate the same Submission textarea.

Label is clearly local-only.

Evaluation loading explains the 20–90 second wait.

Pending state clearly disables the submit action.

Evaluation has a clear overall assessment.

All Findings appear in Criterion order.

Every Finding exposes Level, strengths, weaknesses, improvements, and evidence.

Levels remain qualitative and neutral.

Suggested grade is explicitly advisory.

Follow-up questions are clearly separate from Findings.

Retryable errors have actionable Retry controls.

Configuration errors do not offer Retry.

Errors never expose raw backend responses.

Evaluation page defaults to two columns; the Submission column only appears in the immediate
post-submit render, never as an empty placeholder on other entry paths.

History shows timestamp, Suggested grade, and local Label when available — deliberately not the
overall assessment, which isn't part of the History row contract.

History rows navigate to the same Evaluation view.

Loading, empty, not-found, and error states are designed.

No authentication UI is introduced.

No Rubric-management UI is introduced.

No forbidden domain vocabulary is introduced into visible UI — see the Danish avoid-lists in
CONTEXT.md.

No Level is represented through numeric or ranked-color semantics.

All visible UI copy is Danish, sourced from the centralized strings module (ticket 06).

40. Recommended visual direction

The final product should feel like a quiet professional assessment workspace:

Linear's restraint + Notion's readable content hierarchy + a purpose-built academic assessment interface.

The UI should disappear behind the Educator's task.

The desired experience is not:

"Look at this impressive AI dashboard."

It is:

"I can quickly understand what Rubric AI found, see the evidence, and make my own judgement."

Appendix A. Visual tokens

Concrete values for the qualitative direction in §3.5 and §40, worked one ticket at a time from
`.scratch/rubric-ai-mvp/issues/12-…` onward. Source of truth is `src/index.css`; this appendix
documents what ships there so the spec doesn't drift from the code.

Light is the default, true presentation — the app does not consult the OS/browser
`prefers-color-scheme` preference on first load. Dark remains available, opt-in only, via the
sidebar's manual theme toggle.

Palette (light):

App background:   #F6F6F3
Surface:           #FFFFFF
Primary text:      #202124
Secondary text:    #667085
Muted text:        #98A2B3
Border:            #E2E3E0
Subtle border:     #EEF0ED

Brand accent — Deep Nordic Teal, used sparingly (primary CTA, active nav, links, focus states),
never as a large page background:

Primary:       #285C5B
Hover:         #214B4A
Light surface: #EEF5F3

Dark mode keeps the same structure with a lighter teal tuned for dark contrast, so the brand
color stays consistent across both themes rather than reverting to a different accent.

Typography: a neutral system font stack (`system-ui`) — no separate display font. Page title
(`h1`) 28–32px/600, section heading (`h2`) 18–20px/600, body 14–16px, secondary/metadata text
12–14px using the muted/secondary text tokens above.

Spacing: a fixed scale — 4, 8, 12, 16, 24, 32, 48, 64px — preferred over introducing new UI
elements to fill space.

Borders and shadows: 1px borders in the border token, radius around 8–12px, avoid "pill
everything." Shadows are minimal to absent — prefer a border plus whitespace over a floating
shadow.
