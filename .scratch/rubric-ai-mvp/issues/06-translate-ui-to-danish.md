# 06: Translate the UI to Danish

**What to build:** Every piece of frontend-authored UI copy — page headings, nav labels, form
labels, button text, loading/status text, empty-state copy, and the four `evaluationErrors.js`
messages — moves from English to Danish, across all three existing views (Upload, Evaluation,
History) and shared components (`Nav`, `ErrorBox`, `SuggestedGrade`). This is a pure copy swap: no
layout or behavior changes.

Backend-returned Evaluation content (`overallAssessment`, `findings[].strengths/weaknesses/
improvements/evidence`, `dialogueQuestions`, `level`, `suggestedGrade.value`) is already Danish per
`docs/api/api.md` and the fixtures — nothing about that content changes here.

All new Danish copy is sourced from a single centralized strings module (e.g.
`src/shared/i18n/strings.js`) that every component imports from, rather than literals scattered
inline across components. No i18n library, no language switcher, no English fallback — this is a
single fixed-locale swap, not general internationalization support.

Danish UI labels and their avoid-lists for each domain term (Educator, Submission, Evaluation,
Rubric, Criterion, Level, Finding, Suggested grade, Label) are already recorded in `CONTEXT.md` —
use those as the source of truth for terminology, including the advisory-framing rule that
Suggested grade must always render with its advisory qualifier, never as a bare "Karakter".

**Blocked by:** 05

**Status:** ready-for-agent

- [ ] Every string in the rendered UI across Upload, Evaluation, History, `Nav`, and `ErrorBox` is
      Danish — no leftover English chrome anywhere in the app
- [ ] All Danish UI copy is sourced from one centralized strings module, not hardcoded inline
      literals repeated across components
- [ ] Domain terms use the exact Danish UI labels recorded in `CONTEXT.md` (e.g. Suggested grade
      renders as "Foreslået karakter" with its advisory qualifier, never bare "Karakter"; Level
      renders as "Niveau"; Evaluation never reads as "Bedømmelse")
- [ ] The four `evaluationErrors.js` messages (`invalid_model_output`, `rate_limited`,
      `upstream_unavailable`, `configuration_error`) are rewritten in Danish, keeping their
      existing retryable/non-retryable behavior unchanged
- [ ] Code identifiers, comments, and commit messages stay English — only user-facing copy changes
- [ ] All existing tests are updated to assert against the new Danish copy (or against stable
      roles/structure rather than literal English strings) and the full suite passes

## Comments
