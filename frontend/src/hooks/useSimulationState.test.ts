/**
 * Tests for useSimulationState hook.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSimulationState } from './useSimulationState';
import type { SimulationResponse } from '../services/api';

describe('useSimulationState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSimulationState());

    expect(result.current.state.particle1.mass).toBe(2.0);
    expect(result.current.state.particle1.velocity).toBe(5.0);
    expect(result.current.state.particle2.mass).toBe(3.0);
    expect(result.current.state.particle2.velocity).toBe(-2.0);
    expect(result.current.state.restitution).toBe(1.0);
    expect(result.current.state.collisionType).toBe('elastic');
    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.collisionData).toBeNull();
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.isLoading).toBe(false);
  });

  it('should update particle 1 mass', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setParticle1Mass(5.0);
    });

    expect(result.current.state.particle1.mass).toBe(5.0);
    expect(result.current.state.collisionData).toBeNull(); // Should clear collision data
  });

  it('should update particle 1 velocity', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setParticle1Velocity(10.0);
    });

    expect(result.current.state.particle1.velocity).toBe(10.0);
    expect(result.current.state.collisionData).toBeNull();
  });

  it('should update particle positions', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setParticle1Position(300, 150);
    });

    expect(result.current.state.particle1.x).toBe(300);
    expect(result.current.state.particle1.y).toBe(150);
  });

  it('should update restitution', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setRestitution(0.8);
    });

    expect(result.current.state.restitution).toBe(0.8);
    expect(result.current.state.collisionData).toBeNull();
  });

  it('should update collision type', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setCollisionType('inelastic');
    });

    expect(result.current.state.collisionType).toBe('inelastic');
    expect(result.current.state.collisionData).toBeNull();
  });

  it('should update simulation status', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setStatus('playing');
    });

    expect(result.current.state.status).toBe('playing');
  });

  it('should set collision data and update status', () => {
    const { result } = renderHook(() => useSimulationState());

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

    act(() => {
      result.current.actions.setCollisionData(mockCollisionData);
    });

    expect(result.current.state.collisionData).toEqual(mockCollisionData);
    expect(result.current.state.status).toBe('completed');
  });

  it('should set error and update status', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setError('Connection failed');
    });

    expect(result.current.state.error).toBe('Connection failed');
    expect(result.current.state.status).toBe('error');
    expect(result.current.state.isLoading).toBe(false);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useSimulationState());

    act(() => {
      result.current.actions.setLoading(true);
    });

    expect(result.current.state.isLoading).toBe(true);
  });

  it('should reset simulation', () => {
    const { result } = renderHook(() => useSimulationState());

    // Set some state first
    act(() => {
      result.current.actions.setStatus('completed');
      result.current.actions.setError('Some error');
      result.current.actions.setLoading(true);
      result.current.actions.setParticle1Position(400, 300);
    });

    // Reset
    act(() => {
      result.current.actions.resetSimulation();
    });

    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.collisionData).toBeNull();
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.particle1.x).toBe(200); // Reset to default
    expect(result.current.state.particle2.x).toBe(600); // Reset to default
  });

  it('should load preset', () => {
    const { result } = renderHook(() => useSimulationState());

    const preset = {
      particle1: { mass: 1.5, velocity: 8.0 },
      particle2: { mass: 2.5, velocity: -4.0 },
      restitution: 0.5,
      collisionType: 'custom' as const,
    };

    act(() => {
      result.current.actions.loadPreset(preset);
    });

    expect(result.current.state.particle1.mass).toBe(1.5);
    expect(result.current.state.particle1.velocity).toBe(8.0);
    expect(result.current.state.particle1.x).toBe(200); // Reset position
    expect(result.current.state.particle2.mass).toBe(2.5);
    expect(result.current.state.particle2.velocity).toBe(-4.0);
    expect(result.current.state.particle2.x).toBe(600); // Reset position
    expect(result.current.state.restitution).toBe(0.5);
    expect(result.current.state.collisionType).toBe('custom');
    expect(result.current.state.status).toBe('idle');
    expect(result.current.state.collisionData).toBeNull();
    expect(result.current.state.error).toBeNull();
  });
}); 