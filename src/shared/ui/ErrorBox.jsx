import styles from './ErrorBox.module.css'

/**
 * A non-blocking inline error, optionally with a single action (e.g. Retry).
 * @param {{ message: string, actionLabel?: string, onAction?: () => void }} props
 */
export function ErrorBox({ message, actionLabel, onAction }) {
  return (
    <div className={styles.box} role="alert">
      <p>{message}</p>
      {actionLabel && (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
