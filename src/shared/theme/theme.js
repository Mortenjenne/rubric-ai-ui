const STORAGE_KEY = 'rubric-ai:theme'

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

/** @returns {'light' | 'dark'} the explicitly chosen theme, or 'light' if none was chosen.
 * Light is always the default presentation — the OS/browser color-scheme preference is
 * intentionally not consulted; dark is opt-in only via the manual toggle. */
export function getEffectiveTheme() {
  return readStoredTheme() ?? 'light'
}

/** @param {'light' | 'dark'} theme */
export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // theme still applies for this page view even if it can't be persisted
  }
}

/** Applies the effective theme (the stored choice, or 'light' by default) so the page never
 * falls back to following the OS preference. */
export function applyStoredTheme() {
  document.documentElement.setAttribute('data-theme', getEffectiveTheme())
}
