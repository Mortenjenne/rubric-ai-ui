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

- [ ] Pasting text and submitting shows an in-progress state that explains the 20-90 second wait,
      with the submit button disabled for the duration
- [ ] Uploading a `.md` or `.txt` file populates the same textarea used for pasting
- [ ] Submitting blank/whitespace-only text is blocked in the UI; no request is sent
- [ ] Attempting to navigate away or reload while a submission is in flight triggers a
      confirmation warning
- [ ] On success, the app navigates to `/evaluations/:evaluationId` and renders: overall
      assessment; one Finding per Criterion (Level, strengths, weaknesses, improvements, evidence);
      the Suggested grade, visibly marked advisory; the dialogue questions
- [ ] No Level is ever rendered as a number or a ranked color; no Suggested grade is ever rendered
      as a final/decided mark
- [ ] A Label typed before submitting is present in `localStorage`, keyed by the `evaluationId`
      from the response, after a successful submission

## Comments
