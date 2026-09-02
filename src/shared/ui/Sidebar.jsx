import { NavLink } from 'react-router-dom'
import { Clock, Plus, User } from 'react-feather'
import { strings } from '../i18n/strings'
import { ThemeToggle } from './ThemeToggle'
import styles from './Sidebar.module.css'

function linkClassName({ isActive }) {
  return isActive ? `${styles.link} ${styles.linkActive}` : styles.link
}

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label={strings.sidebar.ariaLabel}>
        <NavLink to="/" end className={linkClassName}>
          <Plus aria-hidden="true" size={16} /> {strings.sidebar.newSubmission}
        </NavLink>
        <NavLink to="/history" className={linkClassName}>
          <Clock aria-hidden="true" size={16} /> {strings.sidebar.history}
        </NavLink>
      </nav>
      <div className={styles.footer}>
        <div className={styles.identity}>
          <User aria-hidden="true" size={16} /> {strings.sidebar.identity}
        </div>
        <ThemeToggle />
      </div>
    </aside>
  )
}
