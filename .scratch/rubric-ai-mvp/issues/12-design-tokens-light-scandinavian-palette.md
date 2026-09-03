# 12: Design tokens — light Scandinavian palette + Deep Nordic Teal accent

**What to build:** Replace the app's design tokens in `src/index.css` with a light-first
Scandinavian palette and a single restrained brand accent (Deep Nordic Teal), per the "UI Polish
& Visual Design Worklist" brief (§1–§2, §Additional Visual Rules). Foundation ticket — every
subsequent polish ticket (13–17) builds on these tokens. No component markup changes here; every
component already consumes `var(--*)` tokens, so this propagates automatically.

- Light becomes the true default presentation: an unset preference no longer follows the OS/
  browser `prefers-color-scheme`, it always renders light. Dark stays available, opt-in only, via
  the existing manual theme toggle.
- Split the previous single `--bg` into `--bg` (app canvas, `#F6F6F3`) and a new `--surface`
  (`#FFFFFF`, for elevated panels/cards/inputs — consumed by tickets 16–17).
- New `--text-muted` tier (`#98A2B3`) for metadata, and a new `--border-subtle` (`#EEF0ED`) for
  quieter dividers (consumed by ticket 14's header).
- Brand accent recolored from purple (`#aa3bff`) to Deep Nordic Teal (`#285C5B`, hover `#214B4A`,
  light surface `#EEF5F3`), plus a new `--accent-hover` token so buttons stop faking hover with
  `opacity: .9`. Dark mode's accent becomes a lighter teal variant (`#5EA39F`) rather than staying
  purple, so the brand color is consistent across both themes.
- Typography scale shrunk from the previous marketing-page sizing (56px `h1`, 18px body with
  0.18px tracking) to a calmer internal-tool scale: `h1` 30px/600, `h2` 19px/600, base body 15px,
  no letter-spacing tracking. Font stack unchanged (`system-ui` already matches the brief's
  recommendation, no new font dependency added).
- New spacing scale tokens (`--space-1` 4px … `--space-8` 64px) as a foundation for tickets 16–17
  to reference when they touch component spacing.
- `--danger`/`--danger-bg`/`--danger-border` (ticket 10) and `--code-bg` left untouched — out of
  scope for this brief.

**Blocked by:** 11

**Status:** ready-for-human

- [x] Default page load (no stored theme choice) renders light regardless of OS color-scheme
      setting; the manual toggle still switches to dark and persists the choice as before
- [x] `--accent` and its hover/bg/border variants are Deep Nordic Teal in light mode and a
      lighter teal variant in dark mode (no purple remains in either theme)
- [x] `--bg`/`--surface` are distinct tokens; nothing regresses visually since no component was
      migrated to `--surface` yet (that happens in 16/17) — they keep using `--bg` until then
- [x] `h1`/`h2`/base body render at the new smaller scale across every page
- [x] All existing tests keep passing unchanged (no component logic touched)

## Comments

`src/shared/theme/theme.js`: `getEffectiveTheme()` now returns `readStoredTheme() ?? 'light'`
(dropped the `systemPrefersDark()` OS check entirely), and `applyStoredTheme()` now always calls
`setAttribute('data-theme', …)` on load instead of only when a stored choice exists — so the page
never falls through to relying on the `prefers-color-scheme` media query. `src/index.css`'s bare
`:root` block now holds the light values directly (rather than a separate
`@media (prefers-color-scheme: dark)` block plus a redundant `[data-theme='light']` override); only
`:root[data-theme='dark']` remains as the opt-in override, removing one of the four places tokens
used to be duplicated.

Documented the concrete values in `docs/design.md` as a new Appendix A, since §3.5/§40 previously
only described the direction qualitatively ("neutral surfaces", "subtle borders") without hex
values — the appendix is the living record of what `src/index.css` actually ships, per ticket.
