/**
 * Tests for the Footer component.
 */

import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('2025 © Shafquat Tabeeb')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
  });

  it('has correct text styling', () => {
    render(<Footer />);
    const text = screen.getByText('2025 © Shafquat Tabeeb');
    expect(text).toHaveClass('font-lexend', 'text-crash-red-bright', 'text-sm');
  });
}); 