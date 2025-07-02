/**
 * Tests for ControlsPanel component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ControlsPanel from './ControlsPanel';

describe('ControlsPanel', () => {
  const defaultProps = {
    particle1: {
      id: 'particle1',
      name: 'Particle 1',
      mass: 2.0,
      velocity: 5.0,
      color: '#ff0000',
    },
    particle2: {
      id: 'particle2',
      name: 'Particle 2',
      mass: 3.0,
      velocity: -2.0,
      color: '#00ff00',
    },
    onParticle1MassChange: vi.fn(),
    onParticle1VelocityChange: vi.fn(),
    onParticle2MassChange: vi.fn(),
    onParticle2VelocityChange: vi.fn(),
    restitution: 0.8,
    collisionType: 'custom' as const,
    onRestitutionChange: vi.fn(),
    onCollisionTypeChange: vi.fn(),
    simulationStatus: 'idle' as const,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
    collisionData: null,
  };

  it('renders main title', () => {
    render(<ControlsPanel {...defaultProps} />);
    
    expect(screen.getByText('Simulation Controls')).toBeInTheDocument();
  });

  it('renders simulation controls', () => {
    render(<ControlsPanel {...defaultProps} />);
    
    expect(screen.getByLabelText('Play simulation')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset simulation')).toBeInTheDocument();
  });

  it('renders particle settings section', () => {
    render(<ControlsPanel {...defaultProps} />);
    
    expect(screen.getByText('Particle Settings')).toBeInTheDocument();
    expect(screen.getByText('Particle 1')).toBeInTheDocument();
    expect(screen.getByText('Particle 2')).toBeInTheDocument();
  });

  it('renders global controls', () => {
    render(<ControlsPanel {...defaultProps} />);
    
    expect(screen.getByText('Collision Settings')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders data panel', () => {
    render(<ControlsPanel {...defaultProps} />);
    
    expect(screen.getByText('Collision Data')).toBeInTheDocument();
  });

  it('disables particle controls when simulation is running', () => {
    render(<ControlsPanel {...defaultProps} simulationStatus="playing" />);
    
    const sliders = screen.getAllByRole('slider');
    // Should have mass and velocity sliders for both particles plus restitution slider
    expect(sliders.length).toBeGreaterThan(0);
    
    // Mass and velocity sliders should be disabled
    const particleSliders = sliders.slice(0, 4); // First 4 are particle sliders
    particleSliders.forEach(slider => {
      expect(slider).toBeDisabled();
    });
  });

  it('enables particle controls when simulation is idle', () => {
    render(<ControlsPanel {...defaultProps} simulationStatus="idle" />);
    
    const sliders = screen.getAllByRole('slider');
    const particleSliders = sliders.slice(0, 4); // First 4 are particle sliders
    particleSliders.forEach(slider => {
      expect(slider).not.toBeDisabled();
    });
  });
}); 