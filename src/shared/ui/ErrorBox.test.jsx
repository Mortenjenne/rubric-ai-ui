import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBox } from './ErrorBox'

describe('ErrorBox', () => {
  it('renders the message in an alert region', () => {
    render(<ErrorBox message="Something failed." />)

    expect(screen.getByRole('alert')).toHaveTextContent('Something failed.')
  })

  it('renders an action button that calls onAction when given', async () => {
    const onAction = vi.fn()
    const user = userEvent.setup()
    render(<ErrorBox message="Something failed." actionLabel="Retry" onAction={onAction} />)

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('renders no button when no actionLabel is given', () => {
    render(<ErrorBox message="Something failed." />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
