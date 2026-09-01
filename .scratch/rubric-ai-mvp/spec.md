# Rubric AI frontend MVP

## Problem Statement

Educators grading 5th-semester internship reports ("praktikrapport" Submissions) manually
cross-reference each one against a fixed, multi-Criterion Rubric — slow, and inconsistent between
Educators. The Rubric AI backend already runs a Submission through an LLM against the Rubric and
returns a structured, advisory Evaluation, but there's no interface for an Educator to submit a
report, read that Evaluation, or find one they looked at before. Today the only way to call the
backend is a raw HTTP request, which isn't usable day-to-day and does nothing to stop the advisory
result from being misread as a decided grade.

## Solution

A React (Vite) frontend, used only by Educators, with three views: Upload (paste or upload a
report, then wait through the 20-90 second LLM call for a fully-rendered Evaluation), Result (a
bookmarkable read of one Evaluation, whether just produced or revisited later), and History (a
list of past Evaluations). The UI enforces the advisory framing the backend contract requires —
Suggested grade and Level are never presented as decided marks. Educators get a private,
client-only way (a Label) to recognize whose Submission is whose, without the backend ever storing
student identity. Two new read endpoints (`GET /api/evaluations`, `GET /api/evaluations/{id}`) are
proposed to the backend team to support History and reload-safe Result viewing; the frontend is
built and verified against a mocked version of that contract so delivery isn't blocked on the
backend team's schedule.

## User Stories

1. As an Educator, I want to paste the full text of a student's praktikrapport into a text box, so
   that I can have it evaluated without leaving the browser.
2. As an Educator, I want to upload a `.md` or `.txt` file instead of pasting, so that I don't have
   to copy-paste from wherever the report already lives.
3. As an Educator, I want the Submit button disabled while an evaluation is in progress, so that I
   can't accidentally fire off two requests for the same report.
4. As an Educator, I want a clear explanation that the evaluation takes 20 to 90 seconds, so that I
   don't think the page has frozen and reload or resubmit.
5. As an Educator, I want to be warned before I navigate away or reload while an evaluation is in
   flight, so that I don't lose 20-90 seconds of work by accident.
6. As an Educator, I want to optionally type a short Label (e.g. a student's name) before
   submitting, so that I can recognize this Evaluation later without the system ever storing the
   student's identity server-side.
7. As an Educator, I want submitting blank text to be blocked before it ever reaches the server, so
   that I don't waste a slow round trip on a request that's guaranteed to fail.
8. As an Educator, I want to see the overall assessment of the report in prose, so that I get a
   quick summary before reading the criterion-by-criterion detail.
9. As an Educator, I want to see one Finding per Criterion of the Rubric, in the Rubric's own
   order, so that I can review the report the same way the Rubric is structured.
10. As an Educator, I want each Finding to show its Level, strengths, weaknesses, improvements, and
    verbatim evidence quotes from the Submission, so that I can quickly see what's backing up the
    assessment.
11. As an Educator, I want the Level for each Finding displayed as a named quality (e.g.
    "Tilfredsstillende"), never as a number or a color implying rank, so that I don't mistake it
    for a grade.
12. As an Educator, I want the Suggested grade clearly marked as advisory, so that I never mistake
    it for a decided mark I could just copy onto the student's transcript.
13. As an Educator, I want to see the dialogue questions the tool proposes, so that I have a
    starting point for a follow-up conversation with the student.
14. As an Educator, when an evaluation fails because the model's output couldn't be trusted, I want
    a plain-language explanation and a Retry button, so that I can try again without reading a raw
    JSON error.
15. As an Educator, when an evaluation fails because the provider rate-limited the request, I want
    to be told to try again in a moment, so that I understand it's transient.
16. As an Educator, when an evaluation fails because the provider was unreachable, I want to be
    offered a retry, so that I can try again once the provider recovers.
17. As an Educator, when an evaluation fails due to a configuration problem on our side, I want to
    be told this is a service problem to report rather than something retrying will fix, so that I
    don't waste time hitting Retry.
18. As an Educator, I want Retry to resubmit the exact text I already entered, so that I don't have
    to re-paste or re-upload after a failure.
19. As an Educator, I want retries to always be something I click, never something that happens
    silently, so that I stay in control of how many attempts are made.
20. As an Educator, I want the URL for a finished Evaluation to be bookmarkable, so that I can come
    back to it later or safely reload the page.
21. As an Educator, I want reloading the Result page after a successful evaluation to show me the
    same result again, so that a refresh never throws away a completed evaluation.
22. As an Educator, I want a History view listing my past Evaluations, so that I can find one I
    looked at before without keeping my own separate records.
23. As an Educator, I want each row in History to show when it was created, its overall assessment,
    and its Suggested grade, so that I can recognize evaluations at a glance.
24. As an Educator, I want to see the Label I typed at upload time next to the matching row in
    History, so that I can tell whose report each row is, entirely from my own browser's memory.
25. As an Educator, I want to click a row in History and land on the same Result view I'd see right
    after submitting, so that browsing history feels consistent with the main flow.
26. As an Educator, I want to get to Upload and History from anywhere in the app via simple
    navigation, so that I'm never stuck on one screen.
27. As an Educator, when I open the app, I want to land on the Upload view by default, so that I
    can start grading immediately rather than clicking through to find it.
28. As an Educator, I want the app to work without logging in, so that getting started doesn't
    require IT to provision me an account first.

## Implementation Decisions

- Three routes: `/` (Upload, default landing route), `/evaluations/:evaluationId` (Result — one
  route serving both the immediate post-submit render and later revisits/reloads), `/history`
  (History, unpaginated).
- Result route: right after a successful `POST /api/evaluations`, render from the in-memory
  response. On a fresh load or reload of the same URL, fetch via the new
  `GET /api/evaluations/{id}` endpoint instead.
- New endpoints proposed to the backend team (not yet implemented; frontend built and tested
  against a mock of this contract):
  - `GET /api/evaluations` — unpaginated list, sorted by `createdAt` descending, returning
    lightweight rows: `evaluationId`, `createdAt`, `overallAssessment`, `suggestedGrade`.
  - `GET /api/evaluations/{id}` — the full `Evaluation` object, same shape as the
    `POST /api/evaluations` response.
  - No new fields on `POST /api/evaluations`: the request contract stays exactly
    `{ submissionText }` — no student-identity field added.
- Label: a free-text string an Educator types in the Upload form before submitting. Stored only in
  the browser's `localStorage`, as a map keyed by `evaluationId`, written once the `POST` response
  returns an id. Never sent to or known by the backend. Shown next to the matching row in History
  and on the Result view when present.
- Upload input: a paste-in textarea, plus a file picker limited to `.md`/`.txt` that reads the file
  client-side and populates the textarea. No PDF/`.docx` conversion in this scope.
- Client-side validation: block submission on blank/whitespace-only text before any request is
  sent, so the plain-Spring 400 error case is never actually exercised by the UI.
- In-flight state: submit button disabled for the duration of the call; a `beforeunload` handler
  warns on navigate-away/reload while the request is outstanding. This is a warning, not a resume
  mechanism — nothing is recoverable if the tab actually closes, since the backend has no job id or
  polling endpoint.
- Error handling: every one of the four `{code, message}` failure shapes (`invalid_model_output`,
  `rate_limited`, `upstream_unavailable`, `configuration_error`) gets its own client-facing copy
  and action, rendered as an inline, non-blocking box near the submit button (the rest of the form
  stays interactive). Three codes offer a manual Retry that resubmits the same text;
  `configuration_error` does not offer retry and is framed as a problem to report. No code ever
  auto-retries client-side.
- Suggested grade and Level rendering: `suggestedGrade` is always labeled advisory in the UI
  (never presented as a final/decided mark); `level` is always rendered as a named quality, never
  mapped to a number or a ranked color scale.
- No authentication in MVP (see ADR 0001) — a single shared, unscoped History list.
- Architecture: feature-folder structure (`src/features/{upload,result,history}/`, each owning its
  own components/hooks/API calls) plus `src/shared/{ui,api,...}/` for cross-feature primitives
  (buttons, the error box, the fetch client, the Query provider).
- Stack: React Router for routing, TanStack Query for server-state fetching/caching/retry
  plumbing, CSS Modules for styling. No Redux/Zustand.
- Rubric visibility (what each Level means, a Rubric reference page) is explicitly out of scope —
  see Out of Scope.

## Testing Decisions

- Single seam: the network boundary. Use MSW (Mock Service Worker) to stub
  `POST /api/evaluations`, `GET /api/evaluations`, and `GET /api/evaluations/{id}` per the contract
  above (including all four error shapes), rather than mocking a fetch wrapper or individual
  hooks/components.
- A good test exercises the app the way an Educator would: render the app, interact via
  `user-event` (paste text, click submit, click a History row), and assert on rendered output —
  never reaching into component internals or the Query cache directly.
- Modules under test: the Upload flow (golden path + all four error shapes + the `beforeunload`
  guard), the Result route (both the post-submit render path and the fetch-by-id path), and the
  History list (including Label lookup from `localStorage`).
- No prior art in this codebase yet — this spec is what introduces the test stack (Vitest, React
  Testing Library, `user-event`, MSW) for the first time.

## Out of Scope

- PDF and `.docx` upload/conversion (backlog, Sprint 2).
- Any Rubric visibility: the `GET /api/rubrics/active` endpoint, Level descriptions on the Result
  view, and a standalone Rubric reference page (backlog, Sprint 2).
- Authentication, accounts, and per-Educator scoping of History (see ADR 0001; revisit if the
  trusted-group assumption stops holding).
- Pagination of `GET /api/evaluations` (revisit if the unpaginated list becomes slow as History
  grows).
- Any backend-modeled submission identity (e.g. a `studentIdentifier` field on
  `POST /api/evaluations`) — the Label stays client-only for this scope.
- Actual backend implementation of the two new `GET` endpoints — this spec only defines the
  contract the frontend expects; building it is the backend team's work, tracked separately.

## Further Notes

- `POST /api/evaluations` has a hard 90-second server-side timeout and no job id or streaming —
  inherited backend behavior the frontend can't change, only design the in-flight UX around.
- The submitted text itself is never persisted by the backend — only short `evidence` quotes
  inside each Finding survive. This is why the Label has to stay client-only: there's no
  submission text or student identity for the backend to echo back later.
- Domain vocabulary (Submission, Rubric, Criterion, Level, Finding, Evaluation, Suggested grade,
  Label, Educator) is defined in `CONTEXT.md` at the repo root.
