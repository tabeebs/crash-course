/**
 * Custom hook for managing canvas animation loop.
 * Provides 60fps animation using requestAnimationFrame.
 */

import { useEffect, useRef, useCallback } from 'react';
import { Particle } from '../types/particle';

interface AnimationState {
  isPlaying: boolean;
  lastTime: number;
}

export const useCanvasAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  particles: Particle[],
  setParticles: React.Dispatch<React.SetStateAction<Particle[]>>
) => {
  const animationStateRef = useRef<AnimationState>({
    isPlaying: false,
    lastTime: 0,
  });
  const animationIdRef = useRef<number>();

  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = animationStateRef.current;
    const deltaTime = currentTime - state.lastTime;
    state.lastTime = currentTime;

    // Only animate if playing
    if (state.isPlaying && deltaTime > 0) {
      // Update particle positions
      setParticles(prevParticles => {
        const updatedParticles = prevParticles.map(particle => {
          const newParticle = new Particle(
            particle.id,
            particle.x,
            particle.y,
            particle.velocity,
            particle.mass,
            particle.color
          );
          newParticle.updatePosition(deltaTime);
          return newParticle;
        });

        // Check for collisions
        for (let i = 0; i < updatedParticles.length; i++) {
          for (let j = i + 1; j < updatedParticles.length; j++) {
            const p1 = updatedParticles[i];
            const p2 = updatedParticles[j];
            
            if (p1.isCollidingWith(p2)) {
              // TODO: Implement collision response using backend API
              // For now, just reverse velocities
              p1.velocity = -p1.velocity * 0.8;
              p2.velocity = -p2.velocity * 0.8;
            }
          }
        }

        return updatedParticles;
      });

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Redraw grid
      drawGrid(ctx, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        particle.draw(ctx);
      });
    }

    // Continue animation loop
    animationIdRef.current = requestAnimationFrame(animate);
  }, [canvasRef, particles, setParticles]);

  const startAnimation = useCallback(() => {
    animationStateRef.current.isPlaying = true;
    animationStateRef.current.lastTime = performance.now();
  }, []);

  const stopAnimation = useCallback(() => {
    animationStateRef.current.isPlaying = false;
  }, []);

  const resetAnimation = useCallback(() => {
    animationStateRef.current.isPlaying = false;
    animationStateRef.current.lastTime = 0;
    
    // Redraw initial state
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
        
        // Draw particles in their current positions
        particles.forEach(particle => {
          particle.draw(ctx);
        });
      }
    }
  }, [canvasRef, particles]);

  useEffect(() => {
    // Start the animation loop
    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      // Cleanup animation on unmount
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animate]);

  return {
    startAnimation,
    stopAnimation,
    resetAnimation,
    isPlaying: animationStateRef.current.isPlaying,
  };
};

/**
 * Helper function to draw grid (duplicated from Canvas component for now).
 */
const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const gridSize = 40;
  
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  
  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}; 