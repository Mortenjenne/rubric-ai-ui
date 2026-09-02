import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('renders nav and navigates between Upload and History', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByRole('link', { name: 'Indlevering' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Historik' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Indlevering' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Historik' }))
    expect(screen.getByRole('heading', { name: 'Historik' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Indlevering' }))
    expect(screen.getByRole('heading', { name: 'Indlevering' })).toBeInTheDocument()
  })
})
