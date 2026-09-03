import { Loader } from 'react-feather'
import styles from './Button.module.css'

/**
 * The app's one shared button/link-styled-as-button primitive, covering every current use case:
 * the filled primary CTA and the neutral/danger outline actions (error retry, empty-state CTA).
 * @param {{
 *   variant?: 'primary' | 'outline',
 *   tone?: 'accent' | 'danger',
 *   loading?: boolean,
 *   as?: import('react').ElementType,
 *   className?: string,
 *   disabled?: boolean,
 *   type?: string,
 * }} props
 */
export function Button({
  variant = 'primary',
  tone = 'accent',
  loading = false,
  as: Component = 'button',
  className,
  children,
  disabled,
  type,
  ...rest
}) {
  const classes = [
    styles.button,
    variant === 'outline' ? styles.outline : styles.primary,
    variant === 'outline' && tone === 'danger' ? styles.dangerTone : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const buttonOnlyProps =
    Component === 'button' ? { type: type ?? 'button', disabled: disabled || loading } : {}

  return (
    <Component {...rest} {...buttonOnlyProps} className={classes} aria-busy={loading || undefined}>
      {loading && <Loader aria-hidden="true" size={14} className="spin-icon" />}
      {children}
    </Component>
  )
}
