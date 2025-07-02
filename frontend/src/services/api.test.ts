/**
 * Tests for API service layer.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiService } from './api';
import type { SimulationRequest, SimulationResponse, Preset } from './api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('apiService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('simulate', () => {
    it('should send simulation request and return response', async () => {
      const mockRequest: SimulationRequest = {
        particle1: { mass: 2, velocity: 5 },
        particle2: { mass: 3, velocity: -2 },
        restitution: 1.0,
      };

      const mockResponse: SimulationResponse = {
        particle1Before: { velocity: 5, momentum: 10, kineticEnergy: 25 },
        particle1After: { velocity: -1, momentum: -2, kineticEnergy: 1 },
        particle2Before: { velocity: -2, momentum: -6, kineticEnergy: 6 },
        particle2After: { velocity: 4, momentum: 12, kineticEnergy: 24 },
        totalMomentumBefore: 4,
        totalMomentumAfter: 4,
        totalKineticEnergyBefore: 31,
        totalKineticEnergyAfter: 25,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.simulate(mockRequest);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/simulate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockRequest),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when simulation fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(apiService.simulate({
        particle1: { mass: 2, velocity: 5 },
        particle2: { mass: 3, velocity: -2 },
        restitution: 1.0,
      })).rejects.toThrow('Failed to simulate collision');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.simulate({
        particle1: { mass: 2, velocity: 5 },
        particle2: { mass: 3, velocity: -2 },
        restitution: 1.0,
      })).rejects.toThrow('Failed to simulate collision');
    });
  });

  describe('getPresets', () => {
    it('should fetch and return presets', async () => {
      const mockPresets: Preset[] = [
        {
          id: 'equal-mass-head-on',
          name: 'Equal Mass - Head On',
          description: 'Two particles of equal mass colliding head-on',
          particle1: { mass: 2, velocity: 5 },
          particle2: { mass: 2, velocity: -5 },
          restitution: 1.0,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPresets,
      });

      const result = await apiService.getPresets();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/presets');
      expect(result).toEqual(mockPresets);
    });

    it('should throw error when fetching presets fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(apiService.getPresets()).rejects.toThrow('Failed to load presets');
    });
  });

  describe('healthCheck', () => {
    it('should return true when backend is healthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      const result = await apiService.healthCheck();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/health', {
        method: 'GET',
      });
      expect(result).toBe(true);
    });

    it('should return false when backend is unhealthy', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const result = await apiService.healthCheck();
      expect(result).toBe(false);
    });

    it('should return false when network error occurs', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await apiService.healthCheck();
      expect(result).toBe(false);
    });
  });
}); 