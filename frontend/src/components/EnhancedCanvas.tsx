/**
 * Enhanced Canvas component with integrated simulation state and collision handling.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Particle } from '../types/particle';
import type { ParticleState, SimulationStatus } from '../hooks/useSimulationState';
import type { SimulationResponse } from '../services/api';

interface EnhancedCanvasProps {
  width?: number;
  height?: number;
  particle1: ParticleState;
  particle2: ParticleState;
  status: SimulationStatus;
  collisionData: SimulationResponse | null;
  onParticle1PositionChange: (x: number, y: number) => void;
  onParticle2PositionChange: (x: number, y: number) => void;
}

const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  width = 800,
  height = 400,
  particle1,
  particle2,
  status,
  collisionData,
  onParticle1PositionChange,
  onParticle2PositionChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [draggedParticle, setDraggedParticle] = useState<Particle | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [collisionDetected, setCollisionDetected] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState<number>(0);

  // Initialize particles from state
  useEffect(() => {
    const p1 = new Particle(
      particle1.id,
      particle1.x,
      particle1.y,
      particle1.velocity,
      particle1.mass,
      particle1.color
    );
    
    const p2 = new Particle(
      particle2.id,
      particle2.x,
      particle2.y,
      particle2.velocity,
      particle2.mass,
      particle2.color
    );

    setParticles([p1, p2]);
  }, [particle1, particle2]);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    drawGrid(ctx, width, height);

    // Update particles during animation
    if (status === 'playing') {
      const deltaTime = currentTime - animationStartTime;
      const timeScale = 0.001; // Scale factor for realistic motion

      setParticles(prevParticles => {
        const updatedParticles = [...prevParticles];
        
        // Update positions
        updatedParticles.forEach(particle => {
          particle.updatePosition(deltaTime * timeScale);
        });

        // Check for collision
        const p1 = updatedParticles[0];
        const p2 = updatedParticles[1];
        
        if (!collisionDetected && p1.isCollidingWith(p2)) {
          setCollisionDetected(true);
          
          // Apply post-collision velocities if available
          if (collisionData) {
            p1.velocity = collisionData.particle1After.velocity;
            p2.velocity = collisionData.particle2After.velocity;
          }
        }

        return updatedParticles;
      });
    }

    // Draw particles
    particles.forEach(particle => {
      particle.draw(ctx);
    });

    // Continue animation if playing
    if (status === 'playing') {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [status, particles, width, height, collisionDetected, collisionData, animationStartTime]);

  // Start/stop animation based on status
  useEffect(() => {
    if (status === 'playing' && !animationRef.current) {
      setAnimationStartTime(performance.now());
      animationRef.current = requestAnimationFrame(animate);
    } else if (status !== 'playing' && animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [status, animate]);

  // Reset collision detection when simulation resets
  useEffect(() => {
    if (status === 'idle') {
      setCollisionDetected(false);
      setAnimationStartTime(0);
    }
  }, [status]);

  // Handle mouse down for drag start
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (status === 'playing') return; // Don't allow dragging during animation
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find particle under mouse
    const particle = particles.find(p => p.containsPoint(x, y));
    if (particle) {
      setDraggedParticle(particle);
      setDragOffset({
        x: x - particle.x,
        y: y - particle.y,
      });
    }
  }, [particles, status]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedParticle) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newX = x - dragOffset.x;
    const newY = y - dragOffset.y;

    // Update particle position locally
    setParticles(prev => prev.map(p => {
      if (p.id === draggedParticle.id) {
        return new Particle(p.id, newX, newY, p.velocity, p.mass, p.color);
      }
      return p;
    }));

    // Notify parent of position change
    if (draggedParticle.id === particle1.id) {
      onParticle1PositionChange(newX, newY);
    } else if (draggedParticle.id === particle2.id) {
      onParticle2PositionChange(newX, newY);
    }
  }, [draggedParticle, dragOffset, particle1.id, particle2.id, onParticle1PositionChange, onParticle2PositionChange]);

  // Handle mouse up for drag end
  const handleMouseUp = useCallback(() => {
    setDraggedParticle(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear and redraw
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    drawGrid(ctx, width, height);
    
    // Draw particles
    particles.forEach(particle => {
      particle.draw(ctx);
    });
  }, [width, height, particles]);

  const getStatusMessage = () => {
    switch (status) {
      case 'idle':
        return 'Drag particles to position • Click Play to start simulation';
      case 'playing':
        return 'Simulation running...';
      case 'paused':
        return 'Simulation paused • Click Play to continue';
      case 'completed':
        return 'Collision complete! Check the data panel for results';
      case 'error':
        return 'Error occurred • Check connection and try again';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex-1 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="border border-gray-700 bg-black cursor-crosshair"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      <div className={`mt-4 text-sm font-lexend text-center transition-colors duration-300 ${
        status === 'error' ? 'text-crash-red' :
        status === 'completed' ? 'text-green-400' :
        status === 'playing' ? 'text-blue-400' :
        'text-gray-400'
      }`}>
        {getStatusMessage()}
      </div>
    </div>
  );
};

/**
 * Draws a background grid on the canvas.
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

export default EnhancedCanvas; 