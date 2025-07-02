/**
 * Tests for DataPanel component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataPanel from './DataPanel';

describe('DataPanel', () => {
  const mockCollisionData = {
    particle1Before: { velocity: 5.0, momentum: 10.0, kineticEnergy: 12.5 },
    particle1After: { velocity: 2.0, momentum: 4.0, kineticEnergy: 2.0 },
    particle2Before: { velocity: -3.0, momentum: -9.0, kineticEnergy: 13.5 },
    particle2After: { velocity: 1.0, momentum: 3.0, kineticEnergy: 1.5 },
    totalMomentumBefore: 1.0,
    totalMomentumAfter: 7.0,
    totalKineticEnergyBefore: 26.0,
    totalKineticEnergyAfter: 3.5,
  };

  const defaultProps = {
    collisionData: mockCollisionData,
    particle1Mass: 2.0,
    particle2Mass: 3.0,
    particle1Color: '#ff0000',
    particle2Color: '#00ff00',
  };

  it('renders placeholder when no collision data', () => {
    render(<DataPanel {...defaultProps} collisionData={null} />);
    
    expect(screen.getByText('Collision Data')).toBeInTheDocument();
    expect(screen.getByText('Run simulation to see collision data')).toBeInTheDocument();
  });

  it('renders particle data with correct colors and masses', () => {
    render(<DataPanel {...defaultProps} />);
    
    expect(screen.getByText('Particle 1 (m = 2.0 kg)')).toBeInTheDocument();
    expect(screen.getByText('Particle 2 (m = 3.0 kg)')).toBeInTheDocument();
    
    const colorIndicators = document.querySelectorAll('.w-3.h-3.rounded-full');
    expect(colorIndicators[0]).toHaveStyle({ backgroundColor: '#ff0000' });
    expect(colorIndicators[1]).toHaveStyle({ backgroundColor: '#00ff00' });
  });

  it('displays before collision data correctly', () => {
    render(<DataPanel {...defaultProps} />);
    
    expect(screen.getAllByText('Before Collision')).toHaveLength(2);
    expect(screen.getByText('v = 5.00 m/s')).toBeInTheDocument();
    expect(screen.getByText('p = 10.00 kg⋅m/s')).toBeInTheDocument();
    expect(screen.getByText('KE = 12.50 J')).toBeInTheDocument();
  });

  it('displays after collision data correctly', () => {
    render(<DataPanel {...defaultProps} />);
    
    expect(screen.getAllByText('After Collision')).toHaveLength(2);
    expect(screen.getByText('v = 2.00 m/s')).toBeInTheDocument();
    expect(screen.getByText('p = 4.00 kg⋅m/s')).toBeInTheDocument();
    expect(screen.getByText('KE = 2.00 J')).toBeInTheDocument();
  });

  it('displays conservation summary', () => {
    render(<DataPanel {...defaultProps} />);
    
    expect(screen.getByText('Conservation Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Momentum')).toBeInTheDocument();
    expect(screen.getByText('Total Kinetic Energy')).toBeInTheDocument();
  });

  it('shows momentum conservation status', () => {
    const conservedMomentumData = {
      ...mockCollisionData,
      totalMomentumBefore: 1.0,
      totalMomentumAfter: 1.0,
    };
    
    render(<DataPanel {...defaultProps} collisionData={conservedMomentumData} />);
    
    const conservedTexts = screen.getAllByText('✓ Conserved');
    expect(conservedTexts.length).toBeGreaterThan(0);
  });

  it('shows energy loss when energy is not conserved', () => {
    render(<DataPanel {...defaultProps} />);
    
    // Energy loss = (26.0 - 3.5) / 26.0 * 100 = 86.5%
    expect(screen.getByText('⚠ Lost: 86.5%')).toBeInTheDocument();
  });

  it('shows energy conservation when energy is conserved', () => {
    const conservedEnergyData = {
      ...mockCollisionData,
      totalKineticEnergyBefore: 10.0,
      totalKineticEnergyAfter: 10.0,
    };
    
    render(<DataPanel {...defaultProps} collisionData={conservedEnergyData} />);
    
    const conservedTexts = screen.getAllByText('✓ Conserved');
    expect(conservedTexts.length).toBeGreaterThan(0);
  });

  it('formats values with correct decimal places', () => {
    const preciseData = {
      ...mockCollisionData,
      particle1Before: { velocity: 5.12345, momentum: 10.98765, kineticEnergy: 12.34567 },
    };
    
    render(<DataPanel {...defaultProps} collisionData={preciseData} />);
    
    expect(screen.getByText('v = 5.12 m/s')).toBeInTheDocument();
    expect(screen.getByText('p = 10.99 kg⋅m/s')).toBeInTheDocument();
    expect(screen.getByText('KE = 12.35 J')).toBeInTheDocument();
  });
}); 