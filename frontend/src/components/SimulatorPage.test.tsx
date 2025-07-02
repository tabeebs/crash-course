/**
 * Tests for SimulatorPage component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimulatorPage from './SimulatorPage';

// Mock the Canvas component
vi.mock('./Canvas', () => ({
  default: () => <div data-testid="canvas-mock">Canvas Component</div>,
}));

describe('SimulatorPage', () => {
  it('renders the simulator page', () => {
    render(<SimulatorPage />);
    // Should have 2 canvas instances (desktop and mobile layouts)
    const canvases = screen.getAllByTestId('canvas-mock');
    expect(canvases).toHaveLength(2);
  });

  it('displays controls header', () => {
    render(<SimulatorPage />);
    // Should have 2 controls headers (desktop and mobile layouts)
    const headers = screen.getAllByText('Controls');
    expect(headers).toHaveLength(2);
  });

  it('shows placeholder text for controls', () => {
    render(<SimulatorPage />);
    // Should have 2 instances of placeholder text
    const placeholders = screen.getAllByText(/Controls coming in Phase 4/);
    expect(placeholders).toHaveLength(2);
  });

  it('has correct background styling', () => {
    const { container } = render(<SimulatorPage />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-black', 'text-white');
  });

  it('has responsive layout classes', () => {
    const { container } = render(<SimulatorPage />);
    // Check for desktop layout
    expect(container.querySelector('.hidden.lg\\:flex')).toBeInTheDocument();
    // Check for mobile layout
    expect(container.querySelector('.lg\\:hidden')).toBeInTheDocument();
  });
}); 