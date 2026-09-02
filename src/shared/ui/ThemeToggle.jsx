import { useState } from 'react'
import { Moon, Sun } from 'react-feather'
import { getEffectiveTheme, setTheme } from '../theme/theme'
import { strings } from '../i18n/strings'
import styles from './ThemeToggle.module.css'

/** A manual light/dark override for Educators who can't rely on their OS/browser reporting the
 * preference they want here (e.g. previewing inside a tool that pins its own color scheme). */
export function ThemeToggle() {
  const [theme, setThemeState] = useState(getEffectiveTheme)

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  const label = theme === 'dark' ? strings.theme.switchToLight : strings.theme.switchToDark

  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-label={label}>
      {theme === 'dark' ? <Sun aria-hidden="true" size={16} /> : <Moon aria-hidden="true" size={16} />}
    </button>
  )
}
