/**
 * Tests for EnhancedCanvas component.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedCanvas from './EnhancedCanvas';
import type { ParticleState } from '../hooks/useSimulationState';
import type { SimulationResponse } from '../services/api';

// Mock the Particle class
vi.mock('../types/particle', () => ({
  Particle: vi.fn().mockImplementation((id, x, y, velocity, mass, color) => ({
    id,
    x,
    y,
    velocity,
    mass,
    color,
    draw: vi.fn(),
    updatePosition: vi.fn(),
    isCollidingWith: vi.fn(() => false),
    containsPoint: vi.fn(() => false),
  })),
}));

// Mock canvas context
const mockContext = {
  fillStyle: '',
  fillRect: vi.fn(),
  strokeStyle: '',
  lineWidth: 0,
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  getContext: vi.fn(),
};

beforeEach(() => {
  (HTMLCanvasElement.prototype.getContext as unknown) = vi.fn(() => mockContext as unknown as CanvasRenderingContext2D);
  Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
    writable: true,
    value: 800,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
    writable: true,
    value: 400,
  });
});

describe('EnhancedCanvas', () => {
  const mockParticle1: ParticleState = {
    id: 'particle1',
    name: 'Particle 1',
    mass: 2.0,
    velocity: 5.0,
    color: '#ff6b6b',
    x: 200,
    y: 200,
  };

  const mockParticle2: ParticleState = {
    id: 'particle2',
    name: 'Particle 2',
    mass: 3.0,
    velocity: -2.0,
    color: '#4ecdc4',
    x: 600,
    y: 200,
  };

  const mockCollisionData: SimulationResponse = {
    particle1Before: { velocity: 5, momentum: 10, kineticEnergy: 25 },
    particle1After: { velocity: -1, momentum: -2, kineticEnergy: 1 },
    particle2Before: { velocity: -2, momentum: -6, kineticEnergy: 6 },
    particle2After: { velocity: 4, momentum: 12, kineticEnergy: 24 },
    totalMomentumBefore: 4,
    totalMomentumAfter: 4,
    totalKineticEnergyBefore: 31,
    totalKineticEnergyAfter: 25,
  };

  const defaultProps = {
    particle1: mockParticle1,
    particle2: mockParticle2,
    status: 'idle' as const,
    collisionData: null,
    onParticle1PositionChange: vi.fn(),
    onParticle2PositionChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render canvas with default dimensions', () => {
    render(<EnhancedCanvas {...defaultProps} />);

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('border', 'border-gray-700', 'bg-black', 'cursor-crosshair');
  });

  it('should render canvas with custom dimensions', () => {
    render(<EnhancedCanvas {...defaultProps} width={600} height={300} />);

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should display status message for idle state', () => {
    render(<EnhancedCanvas {...defaultProps} status="idle" />);

    expect(screen.getByText('Drag particles to position • Click Play to start simulation')).toBeInTheDocument();
  });

  it('should display status message for playing state', () => {
    render(<EnhancedCanvas {...defaultProps} status="playing" />);

    expect(screen.getByText('Simulation running...')).toBeInTheDocument();
  });

  it('should display status message for paused state', () => {
    render(<EnhancedCanvas {...defaultProps} status="paused" />);

    expect(screen.getByText('Simulation paused • Click Play to continue')).toBeInTheDocument();
  });

  it('should display status message for completed state', () => {
    render(<EnhancedCanvas {...defaultProps} status="completed" />);

    expect(screen.getByText('Collision complete! Check the data panel for results')).toBeInTheDocument();
  });

  it('should display status message for error state', () => {
    render(<EnhancedCanvas {...defaultProps} status="error" />);

    expect(screen.getByText('Error occurred • Check connection and try again')).toBeInTheDocument();
  });

  it('should apply correct text color for each status', () => {
    const { rerender } = render(<EnhancedCanvas {...defaultProps} status="idle" />);
    let statusElement = screen.getByText('Drag particles to position • Click Play to start simulation');
    expect(statusElement).toHaveClass('text-gray-400');

    rerender(<EnhancedCanvas {...defaultProps} status="playing" />);
    statusElement = screen.getByText('Simulation running...');
    expect(statusElement).toHaveClass('text-blue-400');

    rerender(<EnhancedCanvas {...defaultProps} status="completed" />);
    statusElement = screen.getByText('Collision complete! Check the data panel for results');
    expect(statusElement).toHaveClass('text-green-400');

    rerender(<EnhancedCanvas {...defaultProps} status="error" />);
    statusElement = screen.getByText('Error occurred • Check connection and try again');
    expect(statusElement).toHaveClass('text-crash-red');
  });

  it('should handle mouse events for drag and drop', () => {
    const mockOnParticle1PositionChange = vi.fn();
    const mockOnParticle2PositionChange = vi.fn();

    render(
      <EnhancedCanvas
        {...defaultProps}
        onParticle1PositionChange={mockOnParticle1PositionChange}
        onParticle2PositionChange={mockOnParticle2PositionChange}
      />
    );

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Test mouse down
    fireEvent.mouseDown(canvas!, { clientX: 220, clientY: 220 });

    // Test mouse move (would trigger drag if particle was found)
    fireEvent.mouseMove(canvas!, { clientX: 230, clientY: 225 });

    // Test mouse up
    fireEvent.mouseUp(canvas!);

    // Test mouse leave
    fireEvent.mouseLeave(canvas!);
  });

  it('should not allow dragging during animation', () => {
    const mockOnParticle1PositionChange = vi.fn();

    render(
      <EnhancedCanvas
        {...defaultProps}
        status="playing"
        onParticle1PositionChange={mockOnParticle1PositionChange}
      />
    );

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Try to start drag during animation
    fireEvent.mouseDown(canvas!, { clientX: 220, clientY: 220 });
    fireEvent.mouseMove(canvas!, { clientX: 230, clientY: 225 });

    // Position change callback should not be called during animation
    expect(mockOnParticle1PositionChange).not.toHaveBeenCalled();
  });

  it('should set canvas dimensions correctly', () => {
    render(<EnhancedCanvas {...defaultProps} width={600} height={300} />);

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeInTheDocument();
    
    // Canvas dimensions should be set via width/height properties
    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(300);
  });

  it('should render with collision data', () => {
    render(
      <EnhancedCanvas
        {...defaultProps}
        status="completed"
        collisionData={mockCollisionData}
      />
    );

    expect(screen.getByText('Collision complete! Check the data panel for results')).toBeInTheDocument();
  });

  it('should handle canvas context not available', () => {
    (HTMLCanvasElement.prototype.getContext as unknown) = vi.fn(() => null);

    render(<EnhancedCanvas {...defaultProps} />);

    // Should not throw error when context is not available
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
}); 