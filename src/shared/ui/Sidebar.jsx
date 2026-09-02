import { NavLink } from 'react-router-dom'
import { strings } from '../i18n/strings'
import styles from './Sidebar.module.css'

function linkClassName({ isActive }) {
  return isActive ? `${styles.link} ${styles.linkActive}` : styles.link
}

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label={strings.sidebar.ariaLabel}>
        <NavLink to="/" end className={linkClassName}>
          <span aria-hidden="true">+</span> {strings.sidebar.newSubmission}
        </NavLink>
        <NavLink to="/history" className={linkClassName}>
          {strings.sidebar.history}
        </NavLink>
      </nav>
      <div className={styles.identity}>
        <span aria-hidden="true">●</span> {strings.sidebar.identity}
      </div>
    </aside>
  )
}
