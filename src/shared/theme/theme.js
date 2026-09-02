const STORAGE_KEY = 'rubric-ai:theme'

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function systemPrefersDark() {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/** @returns {'light' | 'dark'} the explicitly chosen theme, or the OS preference if none was chosen */
export function getEffectiveTheme() {
  return readStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light')
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

/** Applies a previously chosen theme, if any. Otherwise leaves prefers-color-scheme in control,
 * so the page keeps following a live OS theme change until the Educator picks one explicitly. */
export function applyStoredTheme() {
  const stored = readStoredTheme()
  if (stored) document.documentElement.setAttribute('data-theme', stored)
}
