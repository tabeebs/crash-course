/**
 * Enhanced Canvas component with integrated state management and performance optimizations.
 */

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { Particle } from '../types/particle';
import { SimulationStatus } from '../types/simulation';

interface EnhancedCanvasProps {
  particles: Particle[];
  onParticleUpdate: (particles: Particle[]) => void;
  status: SimulationStatus;
  animationData?: any[];
  isAnimating: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
  className?: string;
}

const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({
  particles,
  onParticleUpdate,
  status,
  animationData = [],
  isAnimating,
  canvasWidth = 800,
  canvasHeight = 600,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const animationIndexRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const selectedParticleRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Performance: Memoize particle colors to avoid recalculation
  const particleColors = useMemo(() => ({
    default: '#e12726',
    hover: '#ff4444',
    selected: '#ffffff',
    trail: 'rgba(225, 39, 38, 0.3)',
    animation: '#ff6666'
  }), []);

  // Performance: Memoize canvas dimensions
  const canvasDimensions = useMemo(() => ({
    width: canvasWidth,
    height: canvasHeight
  }), [canvasWidth, canvasHeight]);

  // Performance: Throttled render function to prevent excessive redraws
  const throttledRender = useCallback((timestamp: number) => {
    if (timestamp - lastRenderTimeRef.current < 16) { // ~60fps
      return;
    }
    lastRenderTimeRef.current = timestamp;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas with performance optimization
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid for better visual reference
    if (status === 'idle' || status === 'paused') {
      drawBackgroundGrid(ctx, canvas.width, canvas.height);
    }

    // Draw particles based on status
    if (isAnimating && animationData.length > 0) {
      drawAnimationFrame(ctx);
    } else {
      drawStaticParticles(ctx);
    }

    // Draw UI overlays
    drawStatusOverlay(ctx, canvas.width, canvas.height);
  }, [particles, animationData, isAnimating, status, particleColors]);

  const drawBackgroundGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(225, 39, 38, 0.1)';
    ctx.lineWidth = 0.5;
    
    const gridSize = 50;
    
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
    
    ctx.restore();
  }, []);

  const drawAnimationFrame = useCallback((ctx: CanvasRenderingContext2D) => {
    if (animationIndexRef.current >= animationData.length) {
      animationIndexRef.current = 0;
      return;
    }

    const frameData = animationData[animationIndexRef.current];
    if (!frameData?.particles) return;

    frameData.particles.forEach((particle: Particle, index: number) => {
      drawParticleWithTrail(ctx, particle, index, true);
    });

    animationIndexRef.current++;
  }, [animationData, particleColors]);

  const drawStaticParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particles.forEach((particle, index) => {
      const isSelected = selectedParticleRef.current === index;
      const isHovered = isParticleHovered(particle, mousePositionRef.current);
      
      drawParticleWithTrail(ctx, particle, index, false, isSelected, isHovered);
    });
  }, [particles, particleColors]);

  const drawParticleWithTrail = useCallback((
    ctx: CanvasRenderingContext2D,
    particle: Particle,
    index: number,
    isAnimating: boolean,
    isSelected = false,
    isHovered = false
  ) => {
    ctx.save();

    // Draw particle trail for animation
    if (isAnimating && particle.vx !== undefined && particle.vy !== undefined) {
      const trailLength = 20;
      const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
      
      if (speed > 0.1) {
        ctx.strokeStyle = particleColors.trail;
        ctx.lineWidth = particle.radius * 0.3;
        ctx.beginPath();
        ctx.moveTo(
          particle.x - (particle.vx / speed) * trailLength,
          particle.y - (particle.vy / speed) * trailLength
        );
        ctx.lineTo(particle.x, particle.y);
        ctx.stroke();
      }
    }

    // Draw particle with enhanced visuals
    const radius = isSelected ? particle.radius * 1.2 : particle.radius;
    const color = isSelected 
      ? particleColors.selected 
      : isHovered 
        ? particleColors.hover 
        : isAnimating 
          ? particleColors.animation 
          : particleColors.default;

    // Outer glow for selected/hovered particles
    if (isSelected || isHovered) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    // Main particle circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Inner highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255, 255, 255, ${isSelected ? 0.4 : 0.2})`;
    ctx.beginPath();
    ctx.arc(
      particle.x - radius * 0.3,
      particle.y - radius * 0.3,
      radius * 0.3,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Particle label
    if (isSelected || isHovered || status === 'idle') {
      ctx.fillStyle = 'white';
      ctx.font = '12px Tektur, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `P${index + 1}`,
        particle.x,
        particle.y - radius - 8
      );
      
      // Show velocity if available
      if (particle.vx !== undefined && particle.vy !== undefined) {
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
        ctx.font = '10px Tektur, monospace';
        ctx.fillText(
          `v: ${speed.toFixed(1)}`,
          particle.x,
          particle.y + radius + 15
        );
      }
    }

    ctx.restore();
  }, [particleColors, status]);

  const drawStatusOverlay = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(10, height - 60, 200, 50);
    
    ctx.fillStyle = 'white';
    ctx.font = '14px Tektur, monospace';
    ctx.textAlign = 'left';
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    ctx.fillText(`Status: ${statusText}`, 20, height - 35);
    
    if (isAnimating) {
      const progress = animationData.length > 0 
        ? (animationIndexRef.current / animationData.length * 100).toFixed(1)
        : '0';
      ctx.fillText(`Progress: ${progress}%`, 20, height - 15);
    } else {
      ctx.fillText(`Particles: ${particles.length}`, 20, height - 15);
    }
    
    ctx.restore();
  }, [status, isAnimating, animationData.length, particles.length]);

  const isParticleHovered = useCallback((particle: Particle, mousePos: { x: number; y: number }) => {
    const distance = Math.sqrt(
      (particle.x - mousePos.x) ** 2 + (particle.y - mousePos.y) ** 2
    );
    return distance <= particle.radius + 5; // 5px tolerance
  }, []);

  const getParticleAtPosition = useCallback((x: number, y: number): number | null => {
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      const distance = Math.sqrt((particle.x - x) ** 2 + (particle.y - y) ** 2);
      if (distance <= particle.radius) {
        return i;
      }
    }
    return null;
  }, [particles]);

  // Enhanced mouse interaction handlers
  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (status !== 'idle') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const particleIndex = getParticleAtPosition(x, y);
    if (particleIndex !== null) {
      isDraggingRef.current = true;
      selectedParticleRef.current = particleIndex;
      mousePositionRef.current = { x, y };
    }
  }, [status, getParticleAtPosition]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    mousePositionRef.current = { x, y };

    if (isDraggingRef.current && selectedParticleRef.current !== null) {
      const newParticles = [...particles];
      newParticles[selectedParticleRef.current] = {
        ...newParticles[selectedParticleRef.current],
        x: Math.max(newParticles[selectedParticleRef.current].radius, 
             Math.min(canvas.width - newParticles[selectedParticleRef.current].radius, x)),
        y: Math.max(newParticles[selectedParticleRef.current].radius, 
             Math.min(canvas.height - newParticles[selectedParticleRef.current].radius, y))
      };
      onParticleUpdate(newParticles);
    }

    // Update cursor style
    const hoveredParticle = getParticleAtPosition(x, y);
    canvas.style.cursor = hoveredParticle !== null ? 'pointer' : 'default';
  }, [particles, onParticleUpdate, getParticleAtPosition]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    selectedParticleRef.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
    selectedParticleRef.current = null;
    mousePositionRef.current = { x: -1, y: -1 };
  }, []);

  // Animation loop with performance optimization
  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    const animate = (timestamp: number) => {
      throttledRender(timestamp);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, throttledRender]);

  // Static render for non-animated states
  useEffect(() => {
    if (isAnimating) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    requestAnimationFrame(() => throttledRender(performance.now()));
  }, [particles, status, isAnimating, throttledRender]);

  // Reset animation index when animation data changes
  useEffect(() => {
    animationIndexRef.current = 0;
  }, [animationData]);

  return (
    <div className={`relative border border-crash-red rounded-lg overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="bg-black cursor-default transition-all duration-200"
        aria-label="Interactive particle simulation canvas"
      />
      
      {/* Accessibility overlay */}
      <div className="sr-only">
        Canvas showing {particles.length} particles in {status} state
        {isAnimating && `, animation ${((animationIndexRef.current / Math.max(animationData.length, 1)) * 100).toFixed(1)}% complete`}
      </div>
    </div>
  );
};

export default EnhancedCanvas; 