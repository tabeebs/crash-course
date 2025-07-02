/**
 * Tests for PresetSelector component.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PresetSelector from './PresetSelector';
import type { Preset } from '../services/api';

const mockPresets: Preset[] = [
  {
    id: 'equal-mass-head-on',
    name: 'Equal Mass - Head On',
    description: 'Two particles of equal mass colliding head-on',
    particle1: { mass: 2, velocity: 5 },
    particle2: { mass: 2, velocity: -5 },
    restitution: 1.0,
  },
  {
    id: 'heavy-light-collision',
    name: 'Heavy vs Light',
    description: 'Heavy particle colliding with lighter one',
    particle1: { mass: 5, velocity: 3 },
    particle2: { mass: 1, velocity: 0 },
    restitution: 0.8,
  },
];

describe('PresetSelector', () => {
  const mockOnLoadPreset = vi.fn();
  const mockFetchPresets = vi.fn();

  beforeEach(() => {
    mockOnLoadPreset.mockClear();
    mockFetchPresets.mockClear();
    mockFetchPresets.mockResolvedValue(mockPresets);
  });

  it('should render preset selector with title', () => {
    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    expect(screen.getByText('Simulation Presets')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose a preset scenario:')).toBeInTheDocument();
  });

  it('should fetch presets on mount', async () => {
    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(mockFetchPresets).toHaveBeenCalledTimes(1);
    });
  });

  it('should display presets in select dropdown', async () => {
    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Equal Mass - Head On' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Heavy vs Light' })).toBeInTheDocument();
    });
  });

  it('should call onLoadPreset when preset is selected', async () => {
    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Equal Mass - Head On' })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'equal-mass-head-on' } });

    expect(mockOnLoadPreset).toHaveBeenCalledWith(mockPresets[0]);
  });

  it('should display preset description when selected', async () => {
    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Equal Mass - Head On' })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'equal-mass-head-on' } });

    await waitFor(() => {
      expect(screen.getByText('Two particles of equal mass colliding head-on')).toBeInTheDocument();
      expect(screen.getAllByText(/Mass: 2 kg/)[0]).toBeInTheDocument();
      expect(screen.getByText('Velocity: 5 m/s')).toBeInTheDocument();
      expect(screen.getByText('Velocity: -5 m/s')).toBeInTheDocument();
      expect(screen.getByText('Restitution: 1 (Elastic)')).toBeInTheDocument();
    });
  });

  it('should display loading state while fetching', () => {
    mockFetchPresets.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    expect(screen.getByText('Loading presets...')).toBeInTheDocument();
  });

  it('should display error when fetch fails', async () => {
    mockFetchPresets.mockRejectedValue(new Error('Network error'));

    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load presets')).toBeInTheDocument();
    });
  });

  it('should refresh presets when refresh button is clicked', async () => {
    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(mockFetchPresets).toHaveBeenCalledTimes(1);
    });

    const refreshButton = screen.getByTitle('Refresh presets');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockFetchPresets).toHaveBeenCalledTimes(2);
    });
  });

  it('should disable controls when disabled prop is true', async () => {
    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
        disabled={true}
      />
    );

    await waitFor(() => {
      const select = screen.getByRole('combobox');
      const refreshButton = screen.getByTitle('Refresh presets');
      
      expect(select).toBeDisabled();
      expect(refreshButton).toBeDisabled();
    });
  });

  it('should display no presets message when none available', async () => {
    mockFetchPresets.mockResolvedValue([]);

    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No presets available. Make sure the backend is running.')).toBeInTheDocument();
    });
  });

  it('should handle preset with different restitution values', async () => {
    const customPreset: Preset = {
      id: 'inelastic-collision',
      name: 'Perfectly Inelastic',
      description: 'Particles stick together after collision',
      particle1: { mass: 3, velocity: 4 },
      particle2: { mass: 2, velocity: -1 },
      restitution: 0.0,
    };

    mockFetchPresets.mockResolvedValue([customPreset]);

    render(
      <PresetSelector
        onLoadPreset={mockOnLoadPreset}
        fetchPresets={mockFetchPresets}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Perfectly Inelastic' })).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'inelastic-collision' } });

    await waitFor(() => {
      expect(screen.getByText('Restitution: 0 (Perfectly Inelastic)')).toBeInTheDocument();
    });
  });
}); 