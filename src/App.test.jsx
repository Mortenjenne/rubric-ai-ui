import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { queryClient } from './shared/api/queryClient'

function renderApp() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('App shell', () => {
  it('renders a sidebar and navigates between Upload and History', async () => {
    const user = userEvent.setup()
    renderApp()

    const nav = screen.getByRole('navigation')
    const sidebar = screen.getByRole('complementary')
    const header = screen.getByRole('banner')
    expect(within(nav).getByRole('link', { name: 'Ny indlevering' })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: 'Historik' })).toBeInTheDocument()
    expect(within(sidebar).getByText('Underviser')).toBeInTheDocument()
    expect(within(header).getByText('Rubric AI')).toBeInTheDocument()
    expect(within(header).getByText('Underviser')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Indlevering' })).toBeInTheDocument()

    await user.click(within(nav).getByRole('link', { name: 'Historik' }))
    expect(screen.getByRole('heading', { name: 'Historik' })).toBeInTheDocument()

    await user.click(within(nav).getByRole('link', { name: 'Ny indlevering' }))
    expect(screen.getByRole('heading', { name: 'Indlevering' })).toBeInTheDocument()
  })

  it('has no login, account, or Educator-switching UI', () => {
    renderApp()

    expect(screen.queryByRole('button', { name: /log ind/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /log ind/i })).not.toBeInTheDocument()
  })
})
