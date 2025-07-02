/**
 * API service for communicating with the backend collision engine.
 */

export interface SimulationRequest {
  particle1: {
    mass: number;
    velocity: number;
  };
  particle2: {
    mass: number;
    velocity: number;
  };
  restitution: number;
}

export interface ParticleData {
  velocity: number;
  momentum: number;
  kineticEnergy: number;
}

export interface SimulationResponse {
  particle1Before: ParticleData;
  particle1After: ParticleData;
  particle2Before: ParticleData;
  particle2After: ParticleData;
  totalMomentumBefore: number;
  totalMomentumAfter: number;
  totalKineticEnergyBefore: number;
  totalKineticEnergyAfter: number;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  particle1: {
    mass: number;
    velocity: number;
  };
  particle2: {
    mass: number;
    velocity: number;
  };
  restitution: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Simulates a collision between two particles.
   */
  async simulate(request: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error simulating collision:', error);
      throw new Error('Failed to simulate collision. Please check your connection and try again.');
    }
  }

  /**
   * Fetches available simulation presets.
   */
  async getPresets(): Promise<Preset[]> {
    try {
      const response = await fetch(`${this.baseUrl}/presets`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching presets:', error);
      throw new Error('Failed to load presets. Please check your connection and try again.');
    }
  }

  /**
   * Health check endpoint to verify backend connectivity.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService; 