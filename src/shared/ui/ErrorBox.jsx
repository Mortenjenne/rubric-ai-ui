import { AlertCircle, RefreshCw } from 'react-feather'
import { Button } from './Button'
import styles from './ErrorBox.module.css'

/**
 * A non-blocking inline error, optionally with a single action (e.g. Retry).
 * @param {{ message: string, actionLabel?: string, onAction?: () => void }} props
 */
export function ErrorBox({ message, actionLabel, onAction }) {
  return (
    <div className={styles.box} role="alert">
      <p className={styles.message}>
        <AlertCircle aria-hidden="true" size={16} className={styles.icon} />
        {message}
      </p>
      {actionLabel && (
        <Button variant="outline" tone="danger" onClick={onAction} className={styles.action}>
          <RefreshCw aria-hidden="true" size={14} />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
