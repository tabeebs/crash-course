import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Check for the heading element and button instead of individual letters
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start the collision simulator/i })).toBeInTheDocument()
  })

  it('has correct page title structure', () => {
    render(<App />)
    const titleElement = screen.getByRole('heading', { level: 1 })
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveClass('font-tektur', 'text-white', 'font-bold')
  })

  it('renders landing page by default', () => {
    render(<App />)
    expect(screen.getByText('An interactive 2D collision simulator')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start the collision simulator/i })).toBeInTheDocument()
  })
}) 