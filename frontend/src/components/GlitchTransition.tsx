/**
 * Enhanced Glitch Transition component for cyberpunk-themed page transitions.
 */

import React, { useEffect, useState } from 'react';

interface GlitchTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const GlitchTransition: React.FC<GlitchTransitionProps> = ({ isActive, onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [glitchBars, setGlitchBars] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) return;

    // Create random glitch bars
    const bars = Array.from({ length: 8 }, () => Math.random() * 100);
    setGlitchBars(bars);

    const phases = [
      { duration: 150, intensity: 0.2 },
      { duration: 100, intensity: 0.4 },
      { duration: 80, intensity: 0.6 },
      { duration: 120, intensity: 0.8 },
      { duration: 60, intensity: 1.0 },
      { duration: 200, intensity: 0.7 },
      { duration: 100, intensity: 0.3 },
      { duration: 150, intensity: 0 }
    ];

    let currentPhase = 0;

    const nextPhase = () => {
      if (currentPhase >= phases.length) {
        setTimeout(onComplete, 50); // Small delay for smooth transition
        return;
      }

      setPhase(currentPhase);
      currentPhase++;

      // Update glitch bars occasionally
      if (currentPhase % 2 === 0) {
        setGlitchBars(Array.from({ length: 8 }, () => Math.random() * 100));
      }

      setTimeout(nextPhase, phases[currentPhase - 1]?.duration || 0);
    };

    nextPhase();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const intensity = phase < 5 ? (phase + 1) * 0.2 : Math.max(0, 1 - (phase - 4) * 0.3);

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        background: `radial-gradient(
          ellipse at center,
          rgba(225, 39, 38, ${0.1 * intensity}) 0%,
          rgba(0, 0, 0, ${0.3 + 0.4 * intensity}) 30%,
          rgba(225, 39, 38, ${0.05 * intensity}) 60%,
          rgba(0, 0, 0, ${0.7 + 0.3 * intensity}) 100%
        )`,
        animation: `glitch-main ${0.1 + intensity * 0.05}s infinite linear`
      }}
    >
      {/* Primary scanline effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(225, 39, 38, 0.15) 2px, rgba(225, 39, 38, 0.15) 3px)',
          transform: `translateX(${Math.sin(phase * 3) * (4 * intensity)}px) skewX(${intensity * 2}deg)`,
          opacity: intensity * 0.6,
          filter: `blur(${0.5 * intensity}px) contrast(${1 + intensity})`
        }}
      />

      {/* Secondary horizontal glitch lines */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255, 0, 0, 0.1) 4px, rgba(255, 0, 0, 0.1) 7px)',
          transform: `translateY(${Math.cos(phase * 4) * (3 * intensity)}px) scaleX(${1 + intensity * 0.1})`,
          opacity: intensity * 0.4,
          filter: `blur(${0.3 * intensity}px)`
        }}
      />

      {/* Digital noise pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at ${20 + Math.sin(phase * 7) * 20}% ${30 + Math.cos(phase * 5) * 20}%, rgba(225, 39, 38, ${0.3 * intensity}) 0%, transparent 40%),
            radial-gradient(circle at ${70 + Math.sin(phase * 11) * 15}% ${60 + Math.cos(phase * 9) * 25}%, rgba(255, 0, 0, ${0.2 * intensity}) 0%, transparent 35%)
          `,
          opacity: intensity * 0.8,
          filter: `contrast(${150 + intensity * 100}%) brightness(${120 + intensity * 80}%) saturate(${100 + intensity * 50}%)`
        }}
      />

      {/* Dynamic glitch bars */}
      {glitchBars.map((position, index) => (
        <div
          key={index}
          className="absolute left-0 right-0 bg-crash-red/20 mix-blend-difference"
          style={{
            top: `${position}%`,
            height: `${2 + intensity * 4}px`,
            transform: `translateX(${Math.sin(phase * (2 + index)) * (10 * intensity)}px) scaleX(${0.8 + intensity * 0.4})`,
            opacity: intensity * (0.3 + index * 0.1),
            filter: `blur(${intensity}px)`,
            animation: `glitch-bar-${index % 3} ${0.1 + index * 0.02}s infinite linear`
          }}
        />
      ))}

      {/* RGB split effect */}
      <div 
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background: `linear-gradient(45deg, 
            rgba(255, 0, 0, ${0.1 * intensity}) 0%, 
            transparent 33%, 
            rgba(0, 255, 0, ${0.05 * intensity}) 66%, 
            rgba(0, 0, 255, ${0.08 * intensity}) 100%
          )`,
          transform: `translate(${intensity * 2}px, ${-intensity}px)`,
          filter: `blur(${intensity * 0.5}px)`
        }}
      />

      {/* Digital artifacts */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e12726' fill-opacity='${intensity * 0.1}'%3E%3Crect width='1' height='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: `digital-noise ${0.05 + intensity * 0.03}s infinite linear`
        }}
      />

      {/* Enhanced CSS animations */}
      <style>{`
        @keyframes glitch-main {
          0% { transform: translateX(0) skewX(0deg); }
          5% { transform: translateX(-3px) skewX(5deg); }
          10% { transform: translateX(2px) skewX(-3deg); }
          15% { transform: translateX(-1px) skewX(2deg); }
          20% { transform: translateX(4px) skewX(-4deg); }
          25% { transform: translateX(-2px) skewX(3deg); }
          30% { transform: translateX(1px) skewX(-1deg); }
          35% { transform: translateX(-3px) skewX(4deg); }
          40% { transform: translateX(2px) skewX(-2deg); }
          45% { transform: translateX(-1px) skewX(1deg); }
          50% { transform: translateX(3px) skewX(-3deg); }
          55% { transform: translateX(-2px) skewX(2deg); }
          60% { transform: translateX(1px) skewX(-1deg); }
          65% { transform: translateX(-1px) skewX(1deg); }
          70% { transform: translateX(2px) skewX(-2deg); }
          75% { transform: translateX(-1px) skewX(1deg); }
          80% { transform: translateX(1px) skewX(-1deg); }
          85% { transform: translateX(-1px) skewX(0.5deg); }
          90% { transform: translateX(1px) skewX(-0.5deg); }
          95% { transform: translateX(-1px) skewX(0deg); }
          100% { transform: translateX(0) skewX(0deg); }
        }

        @keyframes glitch-bar-0 {
          0% { transform: translateX(0) scaleX(1); }
          25% { transform: translateX(-5px) scaleX(1.1); }
          50% { transform: translateX(3px) scaleX(0.9); }
          75% { transform: translateX(-2px) scaleX(1.05); }
          100% { transform: translateX(0) scaleX(1); }
        }

        @keyframes glitch-bar-1 {
          0% { transform: translateX(0) scaleX(1); }
          33% { transform: translateX(4px) scaleX(0.8); }
          66% { transform: translateX(-3px) scaleX(1.2); }
          100% { transform: translateX(0) scaleX(1); }
        }

        @keyframes glitch-bar-2 {
          0% { transform: translateX(0) scaleX(1); }
          20% { transform: translateX(-2px) scaleX(1.1); }
          40% { transform: translateX(5px) scaleX(0.7); }
          60% { transform: translateX(-4px) scaleX(1.3); }
          80% { transform: translateX(1px) scaleX(0.9); }
          100% { transform: translateX(0) scaleX(1); }
        }

        @keyframes digital-noise {
          0% { opacity: 0.1; transform: translateX(0); }
          25% { opacity: 0.3; transform: translateX(-1px); }
          50% { opacity: 0.2; transform: translateX(2px); }
          75% { opacity: 0.4; transform: translateX(-1px); }
          100% { opacity: 0.1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default GlitchTransition; 