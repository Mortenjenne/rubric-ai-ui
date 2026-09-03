# 10: Upload error states visual restyle

**What to build:** Restyle `UploadPage`'s existing retryable and non-retryable error handling
(`docs/design.md` §22–§24) to match the rest of the redesigned app's visual language. This is a
pure visual change — no change to which errors are retryable, what triggers Retry, or how the form
behaves while an error is visible.

**Blocked by:** 06

**Status:** ready-for-human

- [x] All four error shapes (`invalid_model_output`, `rate_limited`, `upstream_unavailable`,
      `configuration_error`) render with the new visual style, in the same inline, non-blocking
      location near the submit button
- [x] The three retryable errors still offer a working Retry that resubmits the same text;
      `configuration_error` still offers no Retry and still reads as a problem to report
- [x] The textarea, file picker, and Label field remain editable while an error is visible, exactly
      as before
- [x] All existing `UploadPage` tests (golden path, all four error shapes, the `beforeunload`
      guard) keep passing unchanged
- [x] Visible copy is Danish, sourced from the centralized strings module from ticket 06

## Comments

Implemented by restyling the shared `ErrorBox` component (`src/shared/ui/ErrorBox.module.css`),
which `UploadPage` already used for all four error shapes — no Upload-only stylesheet was needed.
Added `--danger` / `--danger-bg` / `--danger-border` theme tokens to `src/index.css` (mirroring the
existing `--accent` triad, with light/dark variants) so the box's color, background, and border
follow the same token pattern as the rest of the redesigned app, replacing the old hardcoded hex
colors. Since `ErrorBox` is also used by `HistoryPage` and `ResultPage`, this restyle applies there
too — same component, no logic/markup changes to those pages.