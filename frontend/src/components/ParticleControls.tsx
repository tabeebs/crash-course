/**
 * ParticleControls component for individual particle settings.
 */

import React from 'react';
import Slider from './ui/Slider';

interface ParticleControlsProps {
  particleId: string;
  particleName: string;
  mass: number;
  velocity: number;
  color: string;
  onMassChange: (mass: number) => void;
  onVelocityChange: (velocity: number) => void;
  disabled?: boolean;
}

const ParticleControls: React.FC<ParticleControlsProps> = ({
  particleName,
  mass,
  velocity,
  color,
  onMassChange,
  onVelocityChange,
  disabled = false,
}) => {
  return (
    <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
      {/* Header with particle name and color indicator */}
      <div className="flex items-center mb-4">
        <div 
          className="w-4 h-4 rounded-full mr-3 border-2 border-white"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-lg font-tektur text-white">
          {particleName}
        </h3>
      </div>

      {/* Mass slider */}
      <Slider
        label="Mass"
        value={mass}
        min={0.1}
        max={10}
        step={0.1}
        onChange={onMassChange}
        unit=" kg"
        disabled={disabled}
      />

      {/* Velocity slider */}
      <Slider
        label="Initial Velocity"
        value={velocity}
        min={-10}
        max={10}
        step={0.1}
        onChange={onVelocityChange}
        unit=" m/s"
        disabled={disabled}
      />

      {/* Helper text */}
      <div className="mt-3 text-xs text-gray-400 font-lexend">
        {velocity > 0 && '→ Moving right'}
        {velocity < 0 && '← Moving left'}
        {velocity === 0 && '◦ Stationary'}
      </div>
    </div>
  );
};

export default ParticleControls; 