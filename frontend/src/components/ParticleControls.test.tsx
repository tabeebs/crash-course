/**
 * Tests for ParticleControls component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ParticleControls from './ParticleControls';

describe('ParticleControls', () => {
  const defaultProps = {
    particleId: 'particle1',
    particleName: 'Particle 1',
    mass: 2.0,
    velocity: 5.0,
    color: '#ff0000',
    onMassChange: vi.fn(),
    onVelocityChange: vi.fn(),
  };

  it('renders particle name and color indicator', () => {
    render(<ParticleControls {...defaultProps} />);
    
    expect(screen.getByText('Particle 1')).toBeInTheDocument();
    
    const colorIndicator = document.querySelector('.w-4.h-4.rounded-full');
    expect(colorIndicator).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('renders mass and velocity sliders with correct values', () => {
    render(<ParticleControls {...defaultProps} />);
    
    expect(screen.getByText('Mass')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === '2.00 kg';
    })).toBeInTheDocument();
    
    expect(screen.getByText('Initial Velocity')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === '5.00 m/s';
    })).toBeInTheDocument();
  });

  it('calls onMassChange when mass slider changes', () => {
    const mockOnMassChange = vi.fn();
    render(<ParticleControls {...defaultProps} onMassChange={mockOnMassChange} />);
    
    const sliders = screen.getAllByRole('slider');
    const massSlider = sliders[0]; // First slider should be mass
    
    fireEvent.change(massSlider, { target: { value: '3.5' } });
    
    expect(mockOnMassChange).toHaveBeenCalledWith(3.5);
  });

  it('calls onVelocityChange when velocity slider changes', () => {
    const mockOnVelocityChange = vi.fn();
    render(<ParticleControls {...defaultProps} onVelocityChange={mockOnVelocityChange} />);
    
    const sliders = screen.getAllByRole('slider');
    const velocitySlider = sliders[1]; // Second slider should be velocity
    
    fireEvent.change(velocitySlider, { target: { value: '-2.3' } });
    
    expect(mockOnVelocityChange).toHaveBeenCalledWith(-2.3);
  });

  it('displays correct direction indicator for positive velocity', () => {
    render(<ParticleControls {...defaultProps} velocity={3.0} />);
    
    expect(screen.getByText('→ Moving right')).toBeInTheDocument();
  });

  it('displays correct direction indicator for negative velocity', () => {
    render(<ParticleControls {...defaultProps} velocity={-2.0} />);
    
    expect(screen.getByText('← Moving left')).toBeInTheDocument();
  });

  it('displays correct direction indicator for zero velocity', () => {
    render(<ParticleControls {...defaultProps} velocity={0} />);
    
    expect(screen.getByText('◦ Stationary')).toBeInTheDocument();
  });

  it('disables sliders when disabled prop is true', () => {
    render(<ParticleControls {...defaultProps} disabled />);
    
    const sliders = screen.getAllByRole('slider');
    sliders.forEach(slider => {
      expect(slider).toBeDisabled();
    });
  });

  it('enables sliders when disabled prop is false', () => {
    render(<ParticleControls {...defaultProps} disabled={false} />);
    
    const sliders = screen.getAllByRole('slider');
    sliders.forEach(slider => {
      expect(slider).not.toBeDisabled();
    });
  });
}); 