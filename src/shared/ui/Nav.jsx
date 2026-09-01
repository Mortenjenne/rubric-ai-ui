import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

function linkClassName({ isActive }) {
  return isActive ? `${styles.link} ${styles.linkActive}` : styles.link
}

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Main">
      <NavLink to="/" end className={linkClassName}>
        Upload
      </NavLink>
      <NavLink to="/history" className={linkClassName}>
        History
      </NavLink>
    </nav>
  )
}
