/**
 * Tests for SimulationControls component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimulationControls from './SimulationControls';

describe('SimulationControls', () => {
  const defaultProps = {
    status: 'idle' as const,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
  };

  it('renders play button when status is idle', () => {
    render(<SimulationControls {...defaultProps} />);
    
    const playButton = screen.getByLabelText('Play simulation');
    expect(playButton).toBeInTheDocument();
    expect(playButton).not.toBeDisabled();
  });

  it('renders pause button when status is playing', () => {
    render(<SimulationControls {...defaultProps} status="playing" />);
    
    const pauseButton = screen.getByLabelText('Pause simulation');
    expect(pauseButton).toBeInTheDocument();
    expect(pauseButton).not.toBeDisabled();
  });

  it('calls onPlay when play button is clicked', () => {
    const mockOnPlay = vi.fn();
    render(<SimulationControls {...defaultProps} onPlay={mockOnPlay} />);
    
    const playButton = screen.getByLabelText('Play simulation');
    fireEvent.click(playButton);
    
    expect(mockOnPlay).toHaveBeenCalledTimes(1);
  });

  it('calls onPause when pause button is clicked', () => {
    const mockOnPause = vi.fn();
    render(<SimulationControls {...defaultProps} status="playing" onPause={mockOnPause} />);
    
    const pauseButton = screen.getByLabelText('Pause simulation');
    fireEvent.click(pauseButton);
    
    expect(mockOnPause).toHaveBeenCalledTimes(1);
  });

  it('calls onReset when reset button is clicked', () => {
    const mockOnReset = vi.fn();
    render(<SimulationControls {...defaultProps} status="paused" onReset={mockOnReset} />);
    
    const resetButton = screen.getByLabelText('Reset simulation');
    fireEvent.click(resetButton);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('disables reset button when status is idle', () => {
    render(<SimulationControls {...defaultProps} status="idle" />);
    
    const resetButton = screen.getByLabelText('Reset simulation');
    expect(resetButton).toBeDisabled();
  });

  it('enables reset button when status is not idle', () => {
    render(<SimulationControls {...defaultProps} status="paused" />);
    
    const resetButton = screen.getByLabelText('Reset simulation');
    expect(resetButton).not.toBeDisabled();
  });

  it('displays correct status text for idle state', () => {
    render(<SimulationControls {...defaultProps} status="idle" />);
    
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('displays correct status text for playing state', () => {
    render(<SimulationControls {...defaultProps} status="playing" />);
    
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('displays correct status text for paused state', () => {
    render(<SimulationControls {...defaultProps} status="paused" />);
    
    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('displays correct status text for completed state', () => {
    render(<SimulationControls {...defaultProps} status="completed" />);
    
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('allows play from paused state', () => {
    const mockOnPlay = vi.fn();
    render(<SimulationControls {...defaultProps} status="paused" onPlay={mockOnPlay} />);
    
    const playButton = screen.getByLabelText('Play simulation');
    expect(playButton).not.toBeDisabled();
    
    fireEvent.click(playButton);
    expect(mockOnPlay).toHaveBeenCalledTimes(1);
  });

  it('allows play from completed state', () => {
    const mockOnPlay = vi.fn();
    render(<SimulationControls {...defaultProps} status="completed" onPlay={mockOnPlay} />);
    
    const playButton = screen.getByLabelText('Play simulation');
    expect(playButton).not.toBeDisabled();
    
    fireEvent.click(playButton);
    expect(mockOnPlay).toHaveBeenCalledTimes(1);
  });
}); 