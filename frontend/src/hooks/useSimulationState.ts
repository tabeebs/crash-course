/**
 * Custom hook for managing simulation state with useReducer.
 */

import { useReducer, useCallback } from 'react';
import type { SimulationResponse } from '../services/api';

export type SimulationStatus = 'idle' | 'playing' | 'paused' | 'completed' | 'error';
export type CollisionType = 'elastic' | 'inelastic' | 'custom';

export interface ParticleState {
  id: string;
  name: string;
  mass: number;
  velocity: number;
  color: string;
  x: number;
  y: number;
}

export interface SimulationState {
  // Particle states
  particle1: ParticleState;
  particle2: ParticleState;
  
  // Simulation settings
  restitution: number;
  collisionType: CollisionType;
  
  // Simulation status
  status: SimulationStatus;
  
  // Collision data
  collisionData: SimulationResponse | null;
  
  // Error handling
  error: string | null;
  
  // UI state
  isLoading: boolean;
}

export type SimulationAction =
  | { type: 'SET_PARTICLE1_MASS'; payload: number }
  | { type: 'SET_PARTICLE1_VELOCITY'; payload: number }
  | { type: 'SET_PARTICLE1_POSITION'; payload: { x: number; y: number } }
  | { type: 'SET_PARTICLE2_MASS'; payload: number }
  | { type: 'SET_PARTICLE2_VELOCITY'; payload: number }
  | { type: 'SET_PARTICLE2_POSITION'; payload: { x: number; y: number } }
  | { type: 'SET_RESTITUTION'; payload: number }
  | { type: 'SET_COLLISION_TYPE'; payload: CollisionType }
  | { type: 'SET_STATUS'; payload: SimulationStatus }
  | { type: 'SET_COLLISION_DATA'; payload: SimulationResponse }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_SIMULATION' }
  | { type: 'LOAD_PRESET'; payload: { 
      particle1: { mass: number; velocity: number }; 
      particle2: { mass: number; velocity: number }; 
      restitution: number;
      collisionType: CollisionType;
    }};

const initialState: SimulationState = {
  particle1: {
    id: 'particle1',
    name: 'Particle 1',
    mass: 2.0,
    velocity: 5.0,
    color: '#ff6b6b',
    x: 200,
    y: 200,
  },
  particle2: {
    id: 'particle2',
    name: 'Particle 2',
    mass: 3.0,
    velocity: -2.0,
    color: '#4ecdc4',
    x: 600,
    y: 200,
  },
  restitution: 1.0,
  collisionType: 'elastic',
  status: 'idle',
  collisionData: null,
  error: null,
  isLoading: false,
};

function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'SET_PARTICLE1_MASS':
      return {
        ...state,
        particle1: { ...state.particle1, mass: action.payload },
        collisionData: null, // Clear previous results
      };
      
    case 'SET_PARTICLE1_VELOCITY':
      return {
        ...state,
        particle1: { ...state.particle1, velocity: action.payload },
        collisionData: null,
      };
      
    case 'SET_PARTICLE1_POSITION':
      return {
        ...state,
        particle1: { ...state.particle1, ...action.payload },
      };
      
    case 'SET_PARTICLE2_MASS':
      return {
        ...state,
        particle2: { ...state.particle2, mass: action.payload },
        collisionData: null,
      };
      
    case 'SET_PARTICLE2_VELOCITY':
      return {
        ...state,
        particle2: { ...state.particle2, velocity: action.payload },
        collisionData: null,
      };
      
    case 'SET_PARTICLE2_POSITION':
      return {
        ...state,
        particle2: { ...state.particle2, ...action.payload },
      };
      
    case 'SET_RESTITUTION':
      return {
        ...state,
        restitution: action.payload,
        collisionData: null,
      };
      
    case 'SET_COLLISION_TYPE':
      return {
        ...state,
        collisionType: action.payload,
        collisionData: null,
      };
      
    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
        error: action.payload === 'error' ? state.error : null,
      };
      
    case 'SET_COLLISION_DATA':
      return {
        ...state,
        collisionData: action.payload,
        status: 'completed',
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        status: action.payload ? 'error' : state.status,
        isLoading: false,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case 'RESET_SIMULATION':
      return {
        ...state,
        status: 'idle',
        collisionData: null,
        error: null,
        isLoading: false,
        // Reset particle positions to defaults
        particle1: { ...state.particle1, x: 200 },
        particle2: { ...state.particle2, x: 600 },
      };
      
    case 'LOAD_PRESET':
      return {
        ...state,
        particle1: { 
          ...state.particle1, 
          mass: action.payload.particle1.mass,
          velocity: action.payload.particle1.velocity,
          x: 200, // Reset position
        },
        particle2: { 
          ...state.particle2, 
          mass: action.payload.particle2.mass,
          velocity: action.payload.particle2.velocity,
          x: 600, // Reset position
        },
        restitution: action.payload.restitution,
        collisionType: action.payload.collisionType,
        collisionData: null,
        status: 'idle',
        error: null,
      };
      
    default:
      return state;
  }
}

export function useSimulationState() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  // Action creators
  const setParticle1Mass = useCallback((mass: number) => {
    dispatch({ type: 'SET_PARTICLE1_MASS', payload: mass });
  }, []);

  const setParticle1Velocity = useCallback((velocity: number) => {
    dispatch({ type: 'SET_PARTICLE1_VELOCITY', payload: velocity });
  }, []);

  const setParticle1Position = useCallback((x: number, y: number) => {
    dispatch({ type: 'SET_PARTICLE1_POSITION', payload: { x, y } });
  }, []);

  const setParticle2Mass = useCallback((mass: number) => {
    dispatch({ type: 'SET_PARTICLE2_MASS', payload: mass });
  }, []);

  const setParticle2Velocity = useCallback((velocity: number) => {
    dispatch({ type: 'SET_PARTICLE2_VELOCITY', payload: velocity });
  }, []);

  const setParticle2Position = useCallback((x: number, y: number) => {
    dispatch({ type: 'SET_PARTICLE2_POSITION', payload: { x, y } });
  }, []);

  const setRestitution = useCallback((restitution: number) => {
    dispatch({ type: 'SET_RESTITUTION', payload: restitution });
  }, []);

  const setCollisionType = useCallback((collisionType: CollisionType) => {
    dispatch({ type: 'SET_COLLISION_TYPE', payload: collisionType });
  }, []);

  const setStatus = useCallback((status: SimulationStatus) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, []);

  const setCollisionData = useCallback((data: SimulationResponse) => {
    dispatch({ type: 'SET_COLLISION_DATA', payload: data });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const resetSimulation = useCallback(() => {
    dispatch({ type: 'RESET_SIMULATION' });
  }, []);

  const loadPreset = useCallback((preset: {
    particle1: { mass: number; velocity: number };
    particle2: { mass: number; velocity: number };
    restitution: number;
    collisionType: CollisionType;
  }) => {
    dispatch({ type: 'LOAD_PRESET', payload: preset });
  }, []);

  return {
    state,
    actions: {
      setParticle1Mass,
      setParticle1Velocity,
      setParticle1Position,
      setParticle2Mass,
      setParticle2Velocity,
      setParticle2Position,
      setRestitution,
      setCollisionType,
      setStatus,
      setCollisionData,
      setError,
      setLoading,
      resetSimulation,
      loadPreset,
    },
  };
} 