import { User } from 'react-feather'
import { strings } from '../i18n/strings'
import { ThemeToggle } from './ThemeToggle'
import styles from './PageHeader.module.css'

/** A low-contrast bar spanning the full width above the sidebar and the routed page content.
 * "Rubric AI" sits over the sidebar column; identity and the theme toggle sit on the right, over
 * the content column. Navigation lives in the sidebar only — this header carries no nav links. */
export function PageHeader() {
  return (
    <header className={styles.header}>
      <span className={styles.brand}>{strings.app.name}</span>
      <span className={styles.right}>
        <span className={styles.identity}>
          <User aria-hidden="true" size={16} /> {strings.sidebar.identity}
        </span>
        <ThemeToggle />
      </span>
    </header>
  )
}
