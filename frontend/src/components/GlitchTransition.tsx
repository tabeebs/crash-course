/**
 * Glitch Transition component for cyberpunk-themed page transitions.
 */

import React, { useEffect, useState } from 'react';

interface GlitchTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const GlitchTransition: React.FC<GlitchTransitionProps> = ({ isActive, onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      { duration: 100, opacity: 0.9 },
      { duration: 50, opacity: 0.7 },
      { duration: 100, opacity: 0.5 },
      { duration: 75, opacity: 0.3 },
      { duration: 50, opacity: 0.1 },
      { duration: 100, opacity: 0 }
    ];

    let currentPhase = 0;

    const nextPhase = () => {
      if (currentPhase >= phases.length) {
        onComplete();
        return;
      }

      setPhase(currentPhase);
      currentPhase++;

      setTimeout(nextPhase, phases[currentPhase - 1]?.duration || 0);
    };

    nextPhase();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        background: `linear-gradient(
          45deg,
          rgba(225, 39, 38, ${0.1 + phase * 0.15}) 0%,
          rgba(0, 0, 0, ${0.3 + phase * 0.15}) 25%,
          rgba(225, 39, 38, ${0.05 + phase * 0.1}) 50%,
          rgba(0, 0, 0, ${0.5 + phase * 0.1}) 75%,
          rgba(225, 39, 38, ${0.2 + phase * 0.1}) 100%
        )`,
        animation: 'glitch 0.1s infinite'
      }}
    >
      {/* Glitch overlay effects */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(225, 39, 38, 0.1) 2px, rgba(225, 39, 38, 0.1) 4px)',
          transform: `translateX(${Math.sin(phase * 2) * 3}px)`,
          filter: 'blur(0.5px)'
        }}
      />
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255, 0, 0, 0.1) 3px, rgba(255, 0, 0, 0.1) 6px)',
          transform: `translateY(${Math.cos(phase * 3) * 2}px)`,
          filter: 'blur(0.3px)'
        }}
      />

      {/* Static noise effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at ${50 + Math.sin(phase * 5) * 10}% ${50 + Math.cos(phase * 7) * 10}%, rgba(225, 39, 38, 0.2) 0%, transparent 50%)`,
          filter: 'contrast(200%) brightness(150%)'
        }}
      />

      {/* Add CSS animation for glitch effect */}
      <style>{`
        @keyframes glitch {
          0% { transform: translateX(0); }
          10% { transform: translateX(-2px) skewX(5deg); }
          20% { transform: translateX(2px) skewX(-5deg); }
          30% { transform: translateX(-1px) skewX(3deg); }
          40% { transform: translateX(1px) skewX(-3deg); }
          50% { transform: translateX(-2px) skewX(2deg); }
          60% { transform: translateX(2px) skewX(-2deg); }
          70% { transform: translateX(-1px) skewX(1deg); }
          80% { transform: translateX(1px) skewX(-1deg); }
          90% { transform: translateX(-1px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default GlitchTransition; 