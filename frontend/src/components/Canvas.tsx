/**
 * Canvas component for the collision simulation.
 * Uses HTML5 canvas element for rendering particles and animations.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasAnimation } from '../hooks/useCanvasAnimation';
import { Particle } from '../types/particle';

interface CanvasProps {
  width?: number;
  height?: number;
}

const Canvas: React.FC<CanvasProps> = ({ width = 800, height = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [draggedParticle, setDraggedParticle] = useState<Particle | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Custom hook for animation loop
  const { startAnimation, stopAnimation, resetAnimation, isPlaying } = 
    useCanvasAnimation(canvasRef, particles, setParticles);

  // Initialize particles
  useEffect(() => {
    const initialParticles = [
      new Particle('particle1', 200, height / 2, 2, 2, '#ff6b6b'),
      new Particle('particle2', 600, height / 2, -1, 1, '#4ecdc4'),
    ];
    setParticles(initialParticles);
  }, [height]);

  // Handle mouse down for drag start
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlaying) return; // Don't allow dragging during animation
    
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
  }, [particles, isPlaying]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedParticle) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update particle position
    setParticles(prev => prev.map(p => {
      if (p.id === draggedParticle.id) {
        const updatedParticle = new Particle(
          p.id,
          x - dragOffset.x,
          y - dragOffset.y,
          p.velocity,
          p.mass,
          p.color
        );
        return updatedParticle;
      }
      return p;
    }));
  }, [draggedParticle, dragOffset]);

  // Handle mouse up for drag end
  const handleMouseUp = useCallback(() => {
    setDraggedParticle(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

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
      <div className="mt-4 text-sm text-gray-400 font-lexend">
        {isPlaying 
          ? 'Simulation running...' 
          : 'Drag particles to position • Click Play to start simulation'
        }
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

export default Canvas; 