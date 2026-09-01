# 02: Submit a Submission and see its Evaluation

**What to build:** The golden path end to end. An Educator pastes report text (or uploads a
`.md`/`.txt` file, which populates the same textarea) into the Upload view, optionally types a
Label, and submits. Blank/whitespace-only text is blocked client-side before any request is sent.
While the request is in flight, the submit button is disabled and a `beforeunload` guard warns
against navigating away or reloading. On success, the Educator lands on
`/evaluations/:evaluationId`, rendering the full Result view straight from the `POST` response:
overall assessment, all six Findings (Level as a named quality, strengths, weaknesses,
improvements, evidence), the Suggested grade shown unambiguously as advisory (never a decided
mark), and the dialogue questions. The typed Label is saved to `localStorage` keyed by the
returned `evaluationId`.

**Blocked by:** 01

**Status:** ready-for-agent

- [x] Pasting text and submitting shows an in-progress state that explains the 20-90 second wait,
      with the submit button disabled for the duration
- [x] Uploading a `.md` or `.txt` file populates the same textarea used for pasting
- [x] Submitting blank/whitespace-only text is blocked in the UI; no request is sent
- [x] Attempting to navigate away or reload while a submission is in flight triggers a
      confirmation warning
- [x] On success, the app navigates to `/evaluations/:evaluationId` and renders: overall
      assessment; one Finding per Criterion (Level, strengths, weaknesses, improvements, evidence);
      the Suggested grade, visibly marked advisory; the dialogue questions
- [x] No Level is ever rendered as a number or a ranked color; no Suggested grade is ever rendered
      as a final/decided mark
- [x] A Label typed before submitting is present in `localStorage`, keyed by the `evaluationId`
      from the response, after a successful submission

## Comments

Implemented: `UploadPage` (textarea + `.md`/`.txt` file picker populating the same textarea +
optional Label field), a `useCreateEvaluation` mutation wrapping the existing API client, a
`beforeunload` guard active only while the mutation is pending, and client-side blank/whitespace
validation that keeps the submit button disabled (no request sent). On success the Label is saved
to `localStorage` (`src/shared/storage/labels.js`, a map keyed by `evaluationId`) and the app
navigates to `/evaluations/:evaluationId` passing the full `Evaluation` via router state, which
`ResultPage` renders directly — no fetch, per this ticket's scope (fetch-by-id is ticket 04).
Level is always rendered as its plain named-quality string; Suggested grade is always paired with
explicit "(advisory — a starting point, not a decided grade)" copy.

Along the way, also updated `docs/api/api.md`: the backend team has now implemented
`GET /api/evaluations` and `GET /api/evaluations/{id}` for real (previously only a proposed/mocked
contract) — no change to this ticket's scope, but relevant to ticket 04.

`npm test` (12 tests across the Upload flow, ResultPage rendering, and the `labels` storage helper),
`npm run lint`, and `npm run build` all pass. Fixed a pre-existing test-harness gap along the way:
RTL wasn't auto-cleaning up between tests in the same file (no `globals: true` in `vite.config.js`),
so `src/test/setup.js` now calls `cleanup()` from `@testing-library/react` in `afterEach` (also now
clears `localStorage` there). `npm run dev` manually verified to boot and serve the shell cleanly.

Standards and Spec review (two parallel sub-agents) both came back clean — no hard violations, no
missing/wrong requirements. One judgement-call suggestion from the Standards pass (three duplicated
list-rendering blocks in `ResultPage` for Strengths/Weaknesses/Improvements) was applied: factored
into a local `ListSection` component. The other suggestion (no CSS Modules styling yet) was left
as-is — it mirrors the unstyled state of every other page in the app so far and styling wasn't part
of this ticket's scope.
