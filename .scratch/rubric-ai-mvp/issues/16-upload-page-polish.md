# 16: Upload page polish

**What to build:** Apply the tokens from ticket 12 and the `Button` from ticket 13 to
`UploadPage`, per the polish brief's item 7. Structure was already correct from ticket 11 — this
is a refinement pass (typography/spacing/surface), not a rebuild.

- Textarea and Mærkat input backgrounds: `var(--bg)` → `var(--surface)`, so the form controls
  read as elevated surfaces against the app canvas rather than blending into it.
- Metadata text (char count, file-loaded feedback, Mærkat helper text) recolored from `--text` to
  the new `--text-muted` tier, so it reads as secondary at a glance rather than matching body-text
  weight.
- Mærkat input radius bumped 6px → 8px to match the textarea and stay in the brief's 8–12px range
  consistently.
- Spacing moved onto the ticket-12 spacing scale (`--space-*`) throughout the form, replacing the
  ad-hoc rem values — no visible rhythm change since the prior values already mapped closely to
  the scale, just now expressed on it.
- Textarea `min-height` grown slightly (12rem → 14rem) so it reads more clearly as the page's
  visual center per the brief's recommended hierarchy.

**Blocked by:** 15

**Status:** ready-for-human

- [x] Textarea and Mærkat input render on the surface token, not the app-canvas token
- [x] Char count / file-loaded / Mærkat helper text render in the muted tier
- [x] Submit button (from ticket 13) shows the teal primary style with working hover/focus/
      disabled/loading states
- [x] All existing tests keep passing unchanged

## Comments

No markup or behavior changes — every acceptance box ticket 11 already checked (character count,
file-loaded feedback, focus-order/sr-only file input, Danish copy from `strings.js`) still holds;
this ticket only touched CSS values.
