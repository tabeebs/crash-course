/**
 * Tests for Particle class and related types.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Particle } from './particle';

// Mock canvas context
const mockContext = {
  save: vi.fn(),
  restore: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
} as unknown as CanvasRenderingContext2D;

describe('Particle', () => {
  let particle: Particle;

  beforeEach(() => {
    particle = new Particle('test1', 100, 200, 5, 2, '#ff0000');
  });

  describe('constructor', () => {
    it('creates particle with correct properties', () => {
      expect(particle.id).toBe('test1');
      expect(particle.x).toBe(100);
      expect(particle.y).toBe(200);
      expect(particle.velocity).toBe(5);
      expect(particle.mass).toBe(2);
      expect(particle.color).toBe('#ff0000');
    });

    it('calculates radius based on mass', () => {
      const smallParticle = new Particle('small', 0, 0, 0, 0.5);
      const largeParticle = new Particle('large', 0, 0, 0, 10);
      
      // Actual calculation: Math.max(10, Math.min(50, 10 + mass * 5))
      expect(smallParticle.radius).toBe(12.5); // 10 + 0.5 * 5 = 12.5
      expect(largeParticle.radius).toBe(50); // Maximum radius
    });

    it('uses default values when not provided', () => {
      const defaultParticle = new Particle('default', 50, 50);
      expect(defaultParticle.velocity).toBe(0);
      expect(defaultParticle.mass).toBe(1);
      expect(defaultParticle.color).toBe('#ff6b6b');
    });
  });

  describe('updatePosition', () => {
    it('updates position based on velocity and time', () => {
      particle.updatePosition(1000); // 1 second
      
      // Expected: x = x + v * t * scale = 100 + 5 * 1 * 100 = 600
      expect(particle.x).toBe(600);
    });

    it('handles negative velocity', () => {
      particle.velocity = -3;
      particle.updatePosition(500); // 0.5 seconds
      
      // Expected: x = 100 + (-3) * 0.5 * 100 = 100 - 150 = -50
      expect(particle.x).toBe(-50);
    });
  });

  describe('containsPoint', () => {
    it('returns true for points inside particle', () => {
      // Point right at center
      expect(particle.containsPoint(100, 200)).toBe(true);
      
      // Point just inside radius
      expect(particle.containsPoint(100 + particle.radius - 1, 200)).toBe(true);
    });

    it('returns false for points outside particle', () => {
      // Point outside radius
      expect(particle.containsPoint(100 + particle.radius + 1, 200)).toBe(false);
      expect(particle.containsPoint(0, 0)).toBe(false);
    });
  });

  describe('isCollidingWith', () => {
    it('detects collision when particles overlap', () => {
      const other = new Particle('test2', 120, 200, 0, 1); // Close to first particle
      expect(particle.isCollidingWith(other)).toBe(true);
    });

    it('returns false when particles are apart', () => {
      const other = new Particle('test2', 300, 200, 0, 1); // Far from first particle
      expect(particle.isCollidingWith(other)).toBe(false);
    });
  });

  describe('draw', () => {
    it('calls correct canvas methods', () => {
      particle.draw(mockContext);
      
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(100, 200, particle.radius, 0, 2 * Math.PI);
      expect(mockContext.fill).toHaveBeenCalled();
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('draws velocity arrow when velocity is significant', () => {
      particle.velocity = 2;
      particle.draw(mockContext);
      
      // Should call methods for drawing arrow
      expect(mockContext.moveTo).toHaveBeenCalled();
      expect(mockContext.lineTo).toHaveBeenCalled();
    });

    it('does not draw velocity arrow when velocity is too small', () => {
      particle.velocity = 0.05; // Below threshold
      vi.clearAllMocks();
      particle.draw(mockContext);
      
      // Arrow drawing methods should not be called as much
      expect(mockContext.moveTo).toHaveBeenCalledTimes(0);
    });
  });
}); 