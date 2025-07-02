/**
 * Tests for GlobalControls component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalControls from './GlobalControls';

describe('GlobalControls', () => {
  const defaultProps = {
    restitution: 0.8,
    collisionType: 'custom' as const,
    onRestitutionChange: vi.fn(),
    onCollisionTypeChange: vi.fn(),
  };

  it('renders collision settings title', () => {
    render(<GlobalControls {...defaultProps} />);
    
    expect(screen.getByText('Collision Settings')).toBeInTheDocument();
  });

  it('renders collision type selector with correct options', () => {
    render(<GlobalControls {...defaultProps} />);
    
    expect(screen.getByLabelText('Collision Type')).toBeInTheDocument();
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('custom');
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Elastic (e = 1.0)');
    expect(options[1]).toHaveTextContent('Perfectly Inelastic (e = 0.0)');
    expect(options[2]).toHaveTextContent('Custom');
  });

  it('calls onCollisionTypeChange when collision type changes', () => {
    const mockOnCollisionTypeChange = vi.fn();
    const mockOnRestitutionChange = vi.fn();
    render(
      <GlobalControls 
        {...defaultProps} 
        onCollisionTypeChange={mockOnCollisionTypeChange}
        onRestitutionChange={mockOnRestitutionChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'elastic' } });
    
    expect(mockOnCollisionTypeChange).toHaveBeenCalledWith('elastic');
    expect(mockOnRestitutionChange).toHaveBeenCalledWith(1.0);
  });

  it('auto-sets restitution to 0 for inelastic collision', () => {
    const mockOnCollisionTypeChange = vi.fn();
    const mockOnRestitutionChange = vi.fn();
    render(
      <GlobalControls 
        {...defaultProps} 
        onCollisionTypeChange={mockOnCollisionTypeChange}
        onRestitutionChange={mockOnRestitutionChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'inelastic' } });
    
    expect(mockOnCollisionTypeChange).toHaveBeenCalledWith('inelastic');
    expect(mockOnRestitutionChange).toHaveBeenCalledWith(0.0);
  });

  it('renders restitution slider with correct value', () => {
    render(<GlobalControls {...defaultProps} />);
    
    expect(screen.getByText('Coefficient of Restitution (e)')).toBeInTheDocument();
    expect(screen.getByText('0.80')).toBeInTheDocument();
  });

  it('calls onRestitutionChange when restitution slider changes', () => {
    const mockOnRestitutionChange = vi.fn();
    render(<GlobalControls {...defaultProps} onRestitutionChange={mockOnRestitutionChange} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '0.65' } });
    
    expect(mockOnRestitutionChange).toHaveBeenCalledWith(0.65);
  });

  it('disables restitution slider for non-custom collision types', () => {
    render(<GlobalControls {...defaultProps} collisionType="elastic" />);
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
  });

  it('enables restitution slider for custom collision type', () => {
    render(<GlobalControls {...defaultProps} collisionType="custom" />);
    
    const slider = screen.getByRole('slider');
    expect(slider).not.toBeDisabled();
  });

  it('displays correct information text for elastic collision', () => {
    render(<GlobalControls {...defaultProps} collisionType="elastic" />);
    
    expect(screen.getByText('• Perfectly elastic: kinetic energy is conserved')).toBeInTheDocument();
  });

  it('displays correct information text for inelastic collision', () => {
    render(<GlobalControls {...defaultProps} collisionType="inelastic" />);
    
    expect(screen.getByText('• Perfectly inelastic: particles stick together')).toBeInTheDocument();
  });

  it('displays correct information text for custom collision', () => {
    render(<GlobalControls {...defaultProps} collisionType="custom" restitution={0.75} />);
    
    expect(screen.getByText('• Custom: 75% energy retention')).toBeInTheDocument();
  });

  it('disables all controls when disabled prop is true', () => {
    render(<GlobalControls {...defaultProps} disabled />);
    
    const select = screen.getByRole('combobox');
    const slider = screen.getByRole('slider');
    
    expect(select).toBeDisabled();
    expect(slider).toBeDisabled();
  });
}); 