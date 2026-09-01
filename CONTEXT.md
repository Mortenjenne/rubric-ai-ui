# Rubric AI — Frontend

An internal dashboard where Educators submit internship reports to the Rubric AI backend and review
its advisory Evaluation. Students never use this UI.

## Language

**Educator**:
The professional teacher who submits a Submission and makes the actual grading decision. The sole
user of this UI.
_Avoid_: User, teacher

**Submission**:
The full text of a student's internship report, sent for evaluation. Never persisted by the
backend — it exists only for the duration of one evaluation request.
_Avoid_: Document, report, upload

**Evaluation**:
The backend's completed assessment of one Submission: an overall assessment, one Finding per
Criterion, a Suggested grade, and follow-up dialogue questions. Identified by `evaluationId` and
retrievable later by id.
_Avoid_: Result, grading

**Rubric**:
The fixed, versioned set of Criteria and Levels an Evaluation is judged against. Never edited in
place — a new version is seeded instead. Not yet visible anywhere in this UI (see
[BACKLOG.md](./docs/BACKLOG.md)).
_Avoid_: Grading scheme, standard

**Criterion**:
One dimension of the Rubric being judged (e.g. "Formkrav & begrænsninger"), carrying a Weight. A
completed Evaluation has exactly one Finding per Criterion.
_Avoid_: Category, section

**Level**:
One of four ordered quality names (`Mangelfuldt`, `Acceptabelt`, `Tilfredsstillende`, `Udmærket`)
assigned to a Finding for its Criterion. Names a quality, never a grade or number — must never be
mapped to a numeric or color-ranked scale in this UI.
_Avoid_: Grade, score, rating

**Finding**:
One Criterion's worth of an Evaluation: its Level, strengths, weaknesses, improvements, and
verbatim evidence quotes from the Submission.
_Avoid_: Result, item

**Suggested grade**:
An Evaluation's single advisory mark on the 7-trins-skala, always flagged `advisory: true`. A
starting point for the Educator's own judgement — never displayed as a decided or final mark
anywhere in this UI.
_Avoid_: Grade, final grade, score, verdict

**Label**:
A free-text tag an Educator types for a Submission at Upload time, purely to recognize it later in
History (e.g. a student's name). Stored only in the browser's `localStorage`, keyed by
`evaluationId` — never sent to or known by the backend.
_Avoid_: Name, title, student name
