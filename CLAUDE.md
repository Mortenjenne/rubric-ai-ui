# Working conventions

- This is a school project graded on individual/team authorship. Never add Claude as a GitHub
  collaborator, and never include a `Co-Authored-By: Claude` trailer (or similar) in commit
  messages — every commit and every repo collaborator should be a human on this project.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature-slug>/`, not on GitHub. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five canonical labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), unchanged. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
