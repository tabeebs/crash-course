/**
 * Tests for Canvas component.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Canvas from './Canvas';

// Mock the useCanvasAnimation hook
vi.mock('../hooks/useCanvasAnimation', () => ({
  useCanvasAnimation: vi.fn(() => ({
    startAnimation: vi.fn(),
    stopAnimation: vi.fn(),
    resetAnimation: vi.fn(),
    isPlaying: false,
  })),
}));

// Mock HTMLCanvasElement methods
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: '',
    fillRect: vi.fn(),
    strokeStyle: '',
    lineWidth: 0,
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    closePath: vi.fn(),
  })) as any;
});

describe('Canvas', () => {
  it('renders canvas element', () => {
    render(<Canvas />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('displays correct instruction text when not playing', () => {
    render(<Canvas />);
    expect(screen.getByText(/Drag particles to position/)).toBeInTheDocument();
  });

  it('has correct CSS classes applied', () => {
    render(<Canvas />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveClass('border', 'border-gray-700', 'bg-black', 'cursor-crosshair');
  });

  it('applies custom width and height', () => {
    render(<Canvas width={600} height={300} />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(300);
  });

  it('uses default width and height when not specified', () => {
    render(<Canvas />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(400);
  });
}); 