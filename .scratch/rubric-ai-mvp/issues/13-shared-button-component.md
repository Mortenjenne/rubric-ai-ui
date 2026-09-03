# 13: Shared Button component

**What to build:** Introduce the shared `Button` primitive that `docs/design.md` §35 already
listed as intended but was never built, and use it for the primary CTA per the polish brief's
item 3 ("Improve the Primary CTA" — default/hover/focus/disabled/loading states, teal accent).
Also migrate the app's other hand-rolled buttons onto it, since they were duplicating the same
layout/focus/cursor rules with only their color story differing.

- New `src/shared/ui/Button.jsx` + `.module.css`: `variant` (`primary` filled teal / `outline`
  bordered-transparent), `tone` (`accent` / `danger`, outline-only — keeps the error-retry
  button's red-tinted context without a separate component), `loading` (spinner + `aria-busy`,
  reusing the existing `.spin-icon` keyframe), and an `as` prop so it can render as a
  `react-router` `Link` for CTA-styled navigation, not just a real `<button>`.
- `UploadPage`'s submit button: now shows a real loading state (spinner + "Vurderer...") while
  pending, not just a disabled label swap. Real hover (`--accent-hover`) replaces the previous
  `opacity: .9` fake.
- `ErrorBox`'s retry button and `HistoryPage`'s empty-state "Ny indlevering" link both migrated
  onto `Button` (outline variant; `ErrorBox`'s keeps `tone="danger"` to match its red-tinted box).
- `ThemeToggle` intentionally left alone — it's an icon-only toggle, a different shape/purpose
  from the label+action buttons this component covers.

**Blocked by:** 12

**Status:** ready-for-human

- [x] Primary CTA (`UploadPage` submit) has distinct default/hover/focus/disabled/loading
      visuals, using the Deep Nordic Teal accent
- [x] Disabled state stays visually distinct from enabled/hover, not merely dimmed
- [x] `ErrorBox`'s Retry button keeps its red/danger-tinted appearance after migrating to `Button`
- [x] `HistoryPage`'s empty-state CTA renders as a real link (`href="/"`) styled as an outline
      button, not a `<button>` losing navigability
- [x] All existing tests keep passing unchanged (button queries are by accessible role/name, not
      class names, so the markup swap doesn't require test changes)

## Comments

Colored via a `tone` prop rather than letting callers pass a color-overriding `className`, since
two CSS Modules files both targeting `:hover`/`:focus-visible` on the same element would have an
unpredictable cascade order (Vite doesn't guarantee injection order across modules). Keeping both
the structural and color rules inside `Button.module.css` itself means `tone`'s cascade order is
controlled by that one file's source order, not by which stylesheet Vite happens to inject first.
