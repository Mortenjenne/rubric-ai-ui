# 01: Project foundation — routing, data client, test harness

**What to build:** Not user-visible on its own — this is the prefactor that makes every other
ticket in this feature buildable and demoable independently. Set up React Router with the three
MVP routes stubbed (`/` Upload, `/evaluations/:evaluationId` Result, `/history` History) with nav
between Upload and History; a TanStack Query provider plus a typed API client wrapping `fetch`
against a configurable backend base URL; the Vitest + React Testing Library + `user-event` + MSW
test stack, with MSW handlers scaffolded (stubbed, not yet meaningful) for `POST /api/evaluations`,
`GET /api/evaluations`, and `GET /api/evaluations/{id}`; and the `src/features/*` +
`src/shared/*` folder skeleton described in the spec.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] `npm run dev` shows an empty shell with working nav between the three stubbed routes
- [x] A TanStack Query provider wraps the app; a shared API client module exists with a
      configurable base URL (no hardcoded `localhost` in feature code)
- [x] `npm test` runs with Vitest, React Testing Library, `user-event`, and MSW all wired
      together, demonstrated by one trivial passing test that renders the shell and asserts nav
      is present
- [x] `src/features/{upload,result,history}/` and `src/shared/{ui,api}/` exist per the spec's
      feature-folder convention, ready for the next tickets to fill in

## Comments

Implemented in commit `b75b661`. `npm test`, `npm run lint`, and `npm run build` all pass;
`npm run dev` manually verified to serve the shell. Standards and Spec review both came back
clean aside from two minor fixes applied before commit: consistent JSDoc return types on the API
client, and the `VITE_API_BASE_URL` fallback now only applies in dev (throws in a production
build missing the env var, instead of silently shipping pointed at `localhost`).
