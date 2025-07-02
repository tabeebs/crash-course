/**
 * Test suite for LandingPage component.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LandingPage from './LandingPage';

// Mock the router navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Create a wrapper component with router
const LandingPageWithRouter = () => (
  <MemoryRouter>
    <LandingPage />
  </MemoryRouter>
);

describe('LandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    render(<LandingPageWithRouter />);
    expect(screen.getByRole('button', { name: /start the collision simulator/i })).toBeInTheDocument();
  });

  it('renders main title', () => {
    render(<LandingPageWithRouter />);
    // Check for the heading element instead of individual letters
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('CRASHCOURSE'); // Combined without space
  });

  it('renders subtitle', () => {
    render(<LandingPageWithRouter />);
    expect(screen.getByText(/an interactive 2d collision simulator/i)).toBeInTheDocument();
  });

  it('has correct title styling', () => {
    render(<LandingPageWithRouter />);
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toHaveClass('font-tektur', 'text-white', 'font-bold');
  });

  it('has correct subtitle styling', () => {
    render(<LandingPageWithRouter />);
    const subtitle = screen.getByText(/an interactive 2d collision simulator/i);
    expect(subtitle).toHaveClass('font-tektur', 'text-white', 'text-center');
  });

  it('renders Try Now button', () => {
    render(<LandingPageWithRouter />);
    const tryNowButton = screen.getByRole('button', { name: /start the collision simulator/i });
    expect(tryNowButton).toBeInTheDocument();
    expect(tryNowButton).toHaveTextContent('Try Now');
  });

  it('has correct button styling', () => {
    render(<LandingPageWithRouter />);
    const tryNowButton = screen.getByRole('button', { name: /start the collision simulator/i });
    expect(tryNowButton).toHaveClass('font-tektur', 'text-white', 'bg-black', 'border-crash-red');
  });

  it('has black background', () => {
    render(<LandingPageWithRouter />);
    const container = screen.getByRole('heading', { level: 1 }).closest('.bg-black');
    expect(container).toHaveClass('bg-black');
  });

  it('includes Footer component', () => {
    render(<LandingPageWithRouter />);
    expect(screen.getByText('2025 © Shafquat Tabeeb')).toBeInTheDocument();
  });

  it('triggers transition and navigation when Try Now is clicked', () => {
    render(<LandingPageWithRouter />);
    const tryNowButton = screen.getByRole('button', { name: /start the collision simulator/i });
    
    fireEvent.click(tryNowButton);
    
    // Button should be disabled during transition
    expect(tryNowButton).toBeDisabled();
    expect(tryNowButton).toHaveTextContent('Loading...');
  });

  it('shows loading state when transitioning', () => {
    render(<LandingPageWithRouter />);
    const tryNowButton = screen.getByRole('button', { name: /start the collision simulator/i });
    
    fireEvent.click(tryNowButton);
    
    // Check for loading spinner
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(tryNowButton).toHaveClass('animate-pulse');
  });

  it('shows mobile hint on small screens', () => {
    render(<LandingPageWithRouter />);
    const mobileHint = screen.getByText('Best experienced in landscape mode');
    expect(mobileHint).toBeInTheDocument();
    expect(mobileHint).toHaveClass('md:hidden');
  });
}); 