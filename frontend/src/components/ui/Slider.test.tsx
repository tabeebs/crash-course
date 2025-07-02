/**
 * Tests for Slider component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Slider from './Slider';

describe('Slider', () => {
  const defaultProps = {
    label: 'Test Slider',
    value: 5,
    min: 0,
    max: 10,
    step: 1,
    onChange: vi.fn(),
  };

  it('renders with correct label and value', () => {
    render(<Slider {...defaultProps} />);
    
    expect(screen.getByText('Test Slider')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays value with unit when provided', () => {
    render(<Slider {...defaultProps} unit=" kg" />);
    
    expect(screen.getByText('5 kg')).toBeInTheDocument();
  });

  it('formats decimal values correctly', () => {
    render(<Slider {...defaultProps} value={3.14} step={0.1} />);
    
    expect(screen.getByText('3.14')).toBeInTheDocument();
  });

  it('formats integer values correctly', () => {
    render(<Slider {...defaultProps} value={7.0} step={1} />);
    
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn();
    render(<Slider {...defaultProps} onChange={mockOnChange} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '8' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(8);
  });

  it('applies correct attributes to slider input', () => {
    render(<Slider {...defaultProps} />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '10');
    expect(slider).toHaveAttribute('step', '1');
    expect(slider).toHaveValue('5');
  });

  it('handles disabled state correctly', () => {
    render(<Slider {...defaultProps} disabled />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
    expect(slider).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('calculates progress percentage correctly', () => {
    const { container } = render(<Slider {...defaultProps} value={7} />);
    
    // Progress should be 70% (7 out of 10)
    const progressBar = container.querySelector('.bg-crash-red') as HTMLElement;
    expect(progressBar).toHaveStyle({ width: '70%' });
  });

  it('updates progress bar when value changes', () => {
    const { container, rerender } = render(<Slider {...defaultProps} value={3} />);
    
    let progressBar = container.querySelector('.bg-crash-red') as HTMLElement;
    expect(progressBar).toHaveStyle({ width: '30%' });
    
    rerender(<Slider {...defaultProps} value={9} />);
    progressBar = container.querySelector('.bg-crash-red') as HTMLElement;
    expect(progressBar).toHaveStyle({ width: '90%' });
  });
}); 