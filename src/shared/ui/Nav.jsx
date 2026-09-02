import { NavLink } from 'react-router-dom'
import { strings } from '../i18n/strings'
import styles from './Nav.module.css'

function linkClassName({ isActive }) {
  return isActive ? `${styles.link} ${styles.linkActive}` : styles.link
}

export function Nav() {
  return (
    <nav className={styles.nav} aria-label={strings.nav.ariaLabel}>
      <NavLink to="/" end className={linkClassName}>
        {strings.nav.upload}
      </NavLink>
      <NavLink to="/history" className={linkClassName}>
        {strings.nav.history}
      </NavLink>
    </nav>
  )
}
