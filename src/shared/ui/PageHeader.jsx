import { User } from 'react-feather'
import { strings } from '../i18n/strings'
import styles from './PageHeader.module.css'

/** A low-contrast context bar above the routed page content. Navigation lives in the sidebar
 * only — this header repeats identity, not the nav links. */
export function PageHeader() {
  return (
    <header className={styles.header}>
      <span className={styles.name}>{strings.app.name}</span>
      <span className={styles.identity}>
        <User aria-hidden="true" size={16} /> {strings.sidebar.identity}
      </span>
    </header>
  )
}
