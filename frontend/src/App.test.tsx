import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('CRASH COURSE')).toBeInTheDocument()
  })

  it('renders landing page by default', () => {
    render(<App />)
    expect(screen.getByText('An interactive 2D collision simulator')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start the collision simulator/i })).toBeInTheDocument()
  })
}) 