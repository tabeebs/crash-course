/**
 * Test suite for GlitchTransition component.
 */

import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import GlitchTransition from './GlitchTransition';

describe('GlitchTransition', () => {
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders when isActive is true', () => {
    const { container } = render(
      <GlitchTransition isActive={true} onComplete={mockOnComplete} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('does not render when isActive is false', () => {
    const { container } = render(
      <GlitchTransition isActive={false} onComplete={mockOnComplete} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls onComplete after transition duration', async () => {
    render(<GlitchTransition isActive={true} onComplete={mockOnComplete} />);
    
    // Enhanced transition has total duration of around 1200ms
    vi.advanceTimersByTime(1300);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  it('has correct styling classes', () => {
    const { container } = render(
      <GlitchTransition isActive={true} onComplete={mockOnComplete} />
    );
    const glitchElement = container.firstChild as HTMLElement;
    expect(glitchElement).toHaveClass('fixed', 'inset-0', 'z-50', 'pointer-events-none');
  });

  it('includes enhanced glitch animation styles', () => {
    const { container } = render(
      <GlitchTransition isActive={true} onComplete={mockOnComplete} />
    );
    
    // Check that enhanced animations are included
    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
    expect(style?.textContent).toContain('glitch-main');
    expect(style?.textContent).toContain('glitch-bar-0');
    expect(style?.textContent).toContain('digital-noise');
  });

  it('creates dynamic glitch bars', () => {
    const { container } = render(
      <GlitchTransition isActive={true} onComplete={mockOnComplete} />
    );
    
    // Should have 8 glitch bars as defined in the component
    const glitchBars = container.querySelectorAll('[class*="bg-crash-red"]');
    expect(glitchBars.length).toBeGreaterThanOrEqual(8);
  });

  it('has appropriate glitch effects', () => {
    const { container } = render(
      <GlitchTransition isActive={true} onComplete={mockOnComplete} />
    );
    
    // Check for presence of various glitch effect elements using simpler selectors
    expect(container.querySelector('.absolute')).toBeInTheDocument();
    expect(container.querySelector('[style]')).toBeInTheDocument();
  });
}); 