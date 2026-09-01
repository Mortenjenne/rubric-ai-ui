# Backlog

Deferred features and proposed backend additions.

## Sprint 2

- **`GET /api/rubrics/active`** — new backend endpoint returning the active Rubric's Criteria,
  Weights, and Level descriptions: `{ rubricVersion, criteria: [{ key, name, weight, levels: [{
  name, description }] }] }`. The Rubric is already seeded in the database; this only exposes it.
- **Rubric context in the Result view** — enrich each Finding's Level with its official
  description from the Rubric (what "Tilfredsstillende" means for that Criterion), once the
  endpoint above exists.
- **Standalone Rubric reference page** — a read-only page showing the full Rubric, reachable from
  the dashboard nav.
- **PDF / `.docx` upload** — accept richer file formats in the Upload view, converted client-side
  to text/markdown. Deferred because format conversion is a real source of fragile failures; MVP
  ships with paste-in text plus plain `.md`/`.txt` upload only.

## Reconsider later, not yet scheduled

- **Authentication / per-Educator scoping** — see
  [ADR 0001](./adr/0001-no-authentication-in-mvp.md). Revisit if the trusted-group assumption
  stops holding.
- **Pagination for `GET /api/evaluations`** — add `?page=&size=` if the unpaginated list becomes
  slow as History grows.
- **Backend-modeled submission identity** — if the client-only Label proves insufficient (e.g.
  Educators need to search or share across browsers), consider a real `studentIdentifier` field on
  the `POST /api/evaluations` contract instead.
