/**
 * Tests for the GlitchTransition component.
 */

import { render, screen, waitFor } from '@testing-library/react';
import GlitchTransition from './GlitchTransition';

describe('GlitchTransition', () => {
  it('renders nothing when not active', () => {
    const mockOnComplete = vi.fn();
    render(<GlitchTransition isActive={false} onComplete={mockOnComplete} />);
    
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('renders transition overlay when active', () => {
    const mockOnComplete = vi.fn();
    const { container } = render(<GlitchTransition isActive={true} onComplete={mockOnComplete} />);
    
    expect(container.querySelector('.fixed')).toBeInTheDocument();
  });

  it('calls onComplete after transition duration', async () => {
    const mockOnComplete = vi.fn();
    render(<GlitchTransition isActive={true} onComplete={mockOnComplete} />);
    
    // Wait for the transition to complete (total duration should be around 475ms)
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('has correct styling classes', () => {
    const mockOnComplete = vi.fn();
    const { container } = render(<GlitchTransition isActive={true} onComplete={mockOnComplete} />);
    
    const overlay = container.querySelector('.fixed');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'pointer-events-none');
  });

  it('includes glitch animation styles', () => {
    const mockOnComplete = vi.fn();
    const { container } = render(<GlitchTransition isActive={true} onComplete={mockOnComplete} />);
    
    const styleElement = container.querySelector('style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.textContent).toContain('@keyframes glitch');
  });
}); 