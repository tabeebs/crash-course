/**
 * GlobalControls component for simulation-wide settings.
 */

import React from 'react';
import Slider from './ui/Slider';

interface GlobalControlsProps {
  restitution: number;
  collisionType: 'elastic' | 'inelastic' | 'custom';
  onRestitutionChange: (value: number) => void;
  onCollisionTypeChange: (type: 'elastic' | 'inelastic' | 'custom') => void;
  disabled?: boolean;
}

const GlobalControls: React.FC<GlobalControlsProps> = ({
  restitution,
  collisionType,
  onRestitutionChange,
  onCollisionTypeChange,
  disabled = false,
}) => {
  const handleCollisionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value as 'elastic' | 'inelastic' | 'custom';
    onCollisionTypeChange(newType);
    
    // Auto-set restitution based on type
    if (newType === 'elastic') {
      onRestitutionChange(1.0);
    } else if (newType === 'inelastic') {
      onRestitutionChange(0.0);
    }
  };

  return (
    <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
      <h3 className="text-lg font-tektur text-white mb-4">
        Collision Settings
      </h3>

      {/* Collision Type Selector */}
      <div className="mb-4">
        <label htmlFor="collision-type" className="block text-sm font-tektur text-gray-300 mb-2">
          Collision Type
        </label>
        <select
          id="collision-type"
          value={collisionType}
          onChange={handleCollisionTypeChange}
          disabled={disabled}
          className={`
            w-full p-2 bg-gray-900 border border-gray-600 rounded-lg
            text-white font-lexend text-sm
            focus:border-crash-red focus:outline-none focus:ring-1 focus:ring-crash-red
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <option value="elastic">Elastic (e = 1.0)</option>
          <option value="inelastic">Perfectly Inelastic (e = 0.0)</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Coefficient of Restitution Slider */}
      <Slider
        label="Coefficient of Restitution (e)"
        value={restitution}
        min={0}
        max={1}
        step={0.01}
        onChange={onRestitutionChange}
        disabled={disabled || collisionType !== 'custom'}
      />

      {/* Information text */}
      <div className="mt-3 text-xs text-gray-400 font-lexend">
        {collisionType === 'elastic' && '• Perfectly elastic: kinetic energy is conserved'}
        {collisionType === 'inelastic' && '• Perfectly inelastic: particles stick together'}
        {collisionType === 'custom' && `• Custom: ${(restitution * 100).toFixed(0)}% energy retention`}
      </div>
    </div>
  );
};

export default GlobalControls; 