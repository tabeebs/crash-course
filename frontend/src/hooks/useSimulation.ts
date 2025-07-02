/**
 * Main simulation orchestration hook that manages the entire simulation lifecycle.
 */

import { useCallback, useEffect } from 'react';
import { useSimulationState, type CollisionType } from './useSimulationState';
import { apiService, type SimulationRequest, type Preset } from '../services/api';

export function useSimulation() {
  const { state, actions } = useSimulationState();

  /**
   * Starts the simulation by calling the backend API.
   */
  const startSimulation = useCallback(async () => {
    if (state.status === 'playing') return;

    try {
      actions.setLoading(true);
      actions.setError(null);
      actions.setStatus('playing');

      // Prepare API request
      const request: SimulationRequest = {
        particle1: {
          mass: state.particle1.mass,
          velocity: state.particle1.velocity,
        },
        particle2: {
          mass: state.particle2.mass,
          velocity: state.particle2.velocity,
        },
        restitution: state.restitution,
      };

      // Call backend API
      const response = await apiService.simulate(request);

      // Store collision data
      actions.setCollisionData(response);
      actions.setLoading(false);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      actions.setError(errorMessage);
      actions.setStatus('error');
    }
  }, [state.status, state.particle1, state.particle2, state.restitution, actions]);

  /**
   * Pauses the simulation.
   */
  const pauseSimulation = useCallback(() => {
    if (state.status === 'playing') {
      actions.setStatus('paused');
    }
  }, [state.status, actions]);

  /**
   * Resets the simulation to initial state.
   */
  const resetSimulation = useCallback(() => {
    actions.resetSimulation();
  }, [actions]);

  /**
   * Updates particle mass and clears previous collision data.
   */
  const updateParticle1Mass = useCallback((mass: number) => {
    actions.setParticle1Mass(mass);
  }, [actions]);

  const updateParticle1Velocity = useCallback((velocity: number) => {
    actions.setParticle1Velocity(velocity);
  }, [actions]);

  const updateParticle2Mass = useCallback((mass: number) => {
    actions.setParticle2Mass(mass);
  }, [actions]);

  const updateParticle2Velocity = useCallback((velocity: number) => {
    actions.setParticle2Velocity(velocity);
  }, [actions]);

  /**
   * Updates simulation settings.
   */
  const updateRestitution = useCallback((restitution: number) => {
    actions.setRestitution(restitution);
  }, [actions]);

  const updateCollisionType = useCallback((type: CollisionType) => {
    actions.setCollisionType(type);
    
    // Auto-update restitution based on collision type
    if (type === 'elastic') {
      actions.setRestitution(1.0);
    } else if (type === 'inelastic') {
      actions.setRestitution(0.0);
    }
    // For 'custom', keep current restitution value
  }, [actions]);

  /**
   * Updates particle positions (for drag and drop).
   */
  const updateParticle1Position = useCallback((x: number, y: number) => {
    actions.setParticle1Position(x, y);
  }, [actions]);

  const updateParticle2Position = useCallback((x: number, y: number) => {
    actions.setParticle2Position(x, y);
  }, [actions]);

  /**
   * Loads a preset configuration.
   */
  const loadPreset = useCallback((preset: Preset) => {
    const collisionType: CollisionType = 
      preset.restitution === 1.0 ? 'elastic' :
      preset.restitution === 0.0 ? 'inelastic' : 'custom';

    actions.loadPreset({
      particle1: preset.particle1,
      particle2: preset.particle2,
      restitution: preset.restitution,
      collisionType,
    });
  }, [actions]);

  /**
   * Fetches available presets from the backend.
   */
  const fetchPresets = useCallback(async (): Promise<Preset[]> => {
    try {
      const presets = await apiService.getPresets();
      return presets;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load presets';
      actions.setError(errorMessage);
      return [];
    }
  }, [actions]);

  /**
   * Checks backend connectivity.
   */
  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      return await apiService.healthCheck();
    } catch {
      return false;
    }
  }, []);

  // Auto-clear errors after a delay
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        actions.setError(null);
      }, 5000); // Clear error after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [state.error, actions]);

  return {
    // State
    particle1: state.particle1,
    particle2: state.particle2,
    restitution: state.restitution,
    collisionType: state.collisionType,
    status: state.status,
    collisionData: state.collisionData,
    error: state.error,
    isLoading: state.isLoading,

    // Actions
    startSimulation,
    pauseSimulation,
    resetSimulation,
    updateParticle1Mass,
    updateParticle1Velocity,
    updateParticle1Position,
    updateParticle2Mass,
    updateParticle2Velocity,
    updateParticle2Position,
    updateRestitution,
    updateCollisionType,
    loadPreset,
    fetchPresets,
    checkBackendHealth,
  };
} 