# No authentication in MVP

The MVP ships with no login and no per-Educator scoping — everyone who opens the app sees the same
shared History list. We chose this because the initial user base is one small, trusted group of
Educators inside a single AP program, and building auth now would delay shipping without
addressing a real access-control need yet.

## Consequences

Retrofitting auth later means scoping both the `GET /api/evaluations` list/detail endpoints and the
client-only Label storage (currently a flat, unscoped `localStorage` map) per user. See
[BACKLOG.md](../BACKLOG.md) for the trigger condition to revisit this.
