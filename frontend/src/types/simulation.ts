/**
 * Simulation-related type definitions.
 */

export type SimulationStatus = 'idle' | 'playing' | 'paused' | 'completed' | 'error';

export interface SimulationState {
  particle1: ParticleState;
  particle2: ParticleState;
  status: SimulationStatus;
  collisionData: SimulationResponse | null;
  isLoading: boolean;
  error: string | null;
}

export interface ParticleState {
  id: string;
  x: number;
  y: number;
  velocity: number;
  mass: number;
  radius: number;
  color: string;
}

export interface SimulationResponse {
  before: {
    particle1: {
      velocity: number;
      momentum: number;
      kinetic_energy: number;
    };
    particle2: {
      velocity: number;
      momentum: number;
      kinetic_energy: number;
    };
    total_momentum: number;
    total_kinetic_energy: number;
  };
  after: {
    particle1: {
      velocity: number;
      momentum: number;
      kinetic_energy: number;
    };
    particle2: {
      velocity: number;
      momentum: number;
      kinetic_energy: number;
    };
    total_momentum: number;
    total_kinetic_energy: number;
  };
  energy_loss: number;
  conservation_check: string;
} 