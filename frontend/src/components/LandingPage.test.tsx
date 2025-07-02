/**
 * Tests for the LandingPage component.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper component for router context
const LandingPageWithRouter = () => (
  <BrowserRouter>
    <LandingPage />
  </BrowserRouter>
);

describe('LandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders main title', () => {
    render(<LandingPageWithRouter />);
    expect(screen.getByText('CRASH COURSE')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<LandingPageWithRouter />);
    expect(screen.getByText('An interactive 2D collision simulator')).toBeInTheDocument();
  });

  it('renders Try Now button', () => {
    render(<LandingPageWithRouter />);
    expect(screen.getByRole('button', { name: /start the collision simulator/i })).toBeInTheDocument();
  });

  it('has correct title styling', () => {
    render(<LandingPageWithRouter />);
    const title = screen.getByText('CRASH COURSE');
    expect(title).toHaveClass('font-tektur', 'text-white', 'font-bold');
  });

  it('has correct subtitle styling', () => {
    render(<LandingPageWithRouter />);
    const subtitle = screen.getByText('An interactive 2D collision simulator');
    expect(subtitle).toHaveClass('font-tektur', 'text-white', 'opacity-80');
  });

  it('has correct button styling', () => {
    render(<LandingPageWithRouter />);
    const button = screen.getByRole('button', { name: /start the collision simulator/i });
    expect(button).toHaveClass('font-tektur', 'text-white', 'bg-black', 'border-crash-red');
  });

  it('starts transition when Try Now button is clicked', () => {
    render(<LandingPageWithRouter />);
    const button = screen.getByRole('button', { name: /start the collision simulator/i });
    
    fireEvent.click(button);
    
    // Should trigger the glitch transition instead of immediate navigation
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('has black background', () => {
    render(<LandingPageWithRouter />);
    const container = screen.getByText('CRASH COURSE').closest('.bg-black');
    expect(container).toHaveClass('bg-black');
  });

  it('renders footer component', () => {
    render(<LandingPageWithRouter />);
    expect(screen.getByText('2025 © Shafquat Tabeeb')).toBeInTheDocument();
  });
}); 