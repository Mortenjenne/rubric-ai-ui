# Rubric AI — frontend

An internal dashboard where an **Educator** submits a student's internship report (a
**Submission**) to the Rubric AI backend, reads its structured, **advisory** Evaluation, and
revisits past Evaluations later. Students never use this UI — the Educator is its sole reader, and
remains solely responsible for the actual grading decision.

> Like the backend, this frontend was built with **agentic development**, following Matt Pocock's
> AI skills from [aihero.dev](https://www.aihero.dev) — see the backend's
> `HOW-THIS-WAS-BUILT.md` for the process, and the write-up at **[corral.dk](https://www.corral.dk/)**
> for the reflection on what the result was actually worth.

## The task

*AI-vurdering af en opgave ud fra en rubric* — a one-day assignment on the Datamatiker programme:
derive an assessment rubric from real course material, and use an LLM to produce a *vejledende*
(advisory) assessment of a student hand-in against it. Explicitly not an automatic grader.

The hand-in judged is the 5th-semester **praktikrapport**, the internship report that grounds the
final oral exam. The Rubric itself — six Criteria, weights summing to 100, four ordered Levels —
is backend config, not something this UI edits or even displays yet (see
[`docs/BACKLOG.md`](docs/BACKLOG.md)). This repo is the half of the assignment an Educator
actually touches: paste or upload a Submission, wait through the 20–90 second call, then read what
came back.

## Architecture

React 19 · Vite · React Router · TanStack Query · plain CSS Modules, no UI framework.

```
/               Ny indlevering   paste or upload a Submission, submit it
/evaluations/:id Vurdering       read one Evaluation — overall assessment, Findings, Suggested grade
/history        Historik         browse past Evaluations, click through to one
```

Submitting navigates straight into the Evaluation view with the fresh result already in memory —
there's no intermediate "submitted!" page. Every other way of reaching an Evaluation (a reload, a
History click-through, a direct link) fetches it by id instead.

Four ideas carry the design:

- **Advisory is a UI constraint, not just a copy choice.** A Suggested grade is never the
  primary-CTA-colored, decision-shaped element on the page, and a Level renders as a neutral text
  badge — never a number, percentage, star rating, or color-ranked scale. `CONTEXT.md`'s per-term
  *avoid* lists exist specifically so a future addition doesn't quietly reintroduce a "verdict"
  framing the backend was never asked to provide.
- **The Submission text lives in memory, once.** It arrives with the POST response and is shown
  in an optional third column — but only on the immediate post-submit render. A `sessionStorage`
  flag, consumed once per `evaluationId`, is what tells the Evaluation view whether it's allowed
  to show that column; every other entry path (reload, History, a shared link) renders the
  two-column default with no Submission text, because the backend never stored it to begin with.
- **The Label never leaves the browser.** An Educator's free-text tag for recognizing a Submission
  later lives only in `localStorage`, keyed by `evaluationId`, joined onto History rows and the
  Evaluation header client-side. It is never part of any request body — the backend has no concept
  of it.
- **One set of tokens is the whole visual language.** Every component reads CSS custom properties
  (`var(--accent)`, `var(--surface)`, `var(--space-4)`, …) from `src/index.css`; nothing hardcodes
  a color or a one-off spacing value. Retheming — the light/dark toggle, or the move from a stock
  purple accent to Deep Nordic Teal — is a change to one file, not a hunt through every component.

Copy is a fixed single locale: all visible Danish text lives in `src/shared/i18n/strings.js`, and
the domain vocabulary it's built from is `CONTEXT.md` — not re-derived per component, and not
duplicated into `docs/design.md`'s wireframes either.

## Where things are

| | |
| --- | --- |
| [`CONTEXT.md`](CONTEXT.md) | The domain vocabulary — Educator, Submission, Evaluation, Rubric, Criterion, Level, Finding, Suggested grade, Label — each with an *avoid* list |
| [`docs/design.md`](docs/design.md) | The UI design spec: wireframes, states, visual tokens, and the constraints in `CONTEXT.md`'s avoid-lists expressed as layout rules |
| [`docs/adr/`](docs/adr/) | Architecture decision records |
| [`docs/api/api.md`](docs/api/api.md) | The backend's API contract this UI is built against |
| [`docs/BACKLOG.md`](docs/BACKLOG.md) | Deferred features, and why they were deferred |
| [`.scratch/rubric-ai-mvp/issues/`](.scratch/rubric-ai-mvp/issues/) | Specs and tickets, committed alongside the code, one file per ticket |

## Reflection

The reflection on the assignment — what the rubric caught, where the model was weak and
misleading, and the real limits of an LLM for this job — lives as a post at
**[www.corral.dk](https://www.corral.dk/)** rather than in either repo.

The backend that judges each Submission and produces the Evaluations this UI displays lives in the
sibling `rubric-ai-backend` repo.
