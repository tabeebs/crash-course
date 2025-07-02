/**
 * PresetSelector component for loading predefined simulation scenarios.
 */

import React, { useEffect, useState } from 'react';
import type { Preset } from '../services/api';

interface PresetSelectorProps {
  onLoadPreset: (preset: Preset) => void;
  fetchPresets: () => Promise<Preset[]>;
  disabled?: boolean;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  onLoadPreset,
  fetchPresets,
  disabled = false,
}) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load presets on component mount
  useEffect(() => {
    const loadPresets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedPresets = await fetchPresets();
        setPresets(fetchedPresets);
      } catch (err) {
        setError('Failed to load presets');
        console.error('Error loading presets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPresets();
  }, [fetchPresets]);

  const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = event.target.value;
    setSelectedPreset(presetId);

    if (presetId) {
      const preset = presets.find(p => p.id === presetId);
      if (preset) {
        onLoadPreset(preset);
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedPresets = await fetchPresets();
      setPresets(fetchedPresets);
          } catch {
        setError('Failed to refresh presets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-tektur text-white">
          Simulation Presets
        </h3>
        <button
          onClick={handleRefresh}
          disabled={disabled || isLoading}
          className={`
            px-3 py-1 text-xs rounded border transition-all duration-200
            ${disabled || isLoading 
              ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
              : 'border-gray-500 text-gray-300 hover:border-crash-red hover:text-crash-red'
            }
          `}
          title="Refresh presets"
        >
          {isLoading ? '⟳' : '↻'}
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-crash-red/10 border border-crash-red/30 rounded text-crash-red text-xs">
          {error}
        </div>
      )}

      <div className="mb-2">
        <label htmlFor="preset-selector" className="block text-sm font-tektur text-gray-300 mb-2">
          Choose a preset scenario:
        </label>
        <select
          id="preset-selector"
          value={selectedPreset}
          onChange={handlePresetChange}
          disabled={disabled || isLoading || presets.length === 0}
          className={`
            w-full p-2 bg-gray-900 border border-gray-600 rounded-lg
            text-white font-lexend text-sm
            focus:border-crash-red focus:outline-none focus:ring-1 focus:ring-crash-red
            ${disabled || isLoading || presets.length === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer'
            }
          `}
        >
          <option value="">
            {isLoading 
              ? 'Loading presets...' 
              : presets.length === 0 
                ? 'No presets available' 
                : 'Select a preset'
            }
          </option>
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show preset description */}
      {selectedPreset && (
        <div className="mt-3 p-3 bg-gray-900/50 rounded-lg">
          {(() => {
            const preset = presets.find(p => p.id === selectedPreset);
            return preset ? (
              <div>
                <h4 className="text-sm font-tektur text-crash-red mb-2">
                  {preset.name}
                </h4>
                <p className="text-xs text-gray-300 font-lexend mb-3">
                  {preset.description}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs font-lexend">
                  <div>
                    <div className="text-gray-400 mb-1">Particle 1</div>
                    <div className="text-white">Mass: {preset.particle1.mass} kg</div>
                    <div className="text-white">Velocity: {preset.particle1.velocity} m/s</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Particle 2</div>
                    <div className="text-white">Mass: {preset.particle2.mass} kg</div>
                    <div className="text-white">Velocity: {preset.particle2.velocity} m/s</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-300">
                  Restitution: {preset.restitution} 
                  {preset.restitution === 1 && ' (Elastic)'}
                  {preset.restitution === 0 && ' (Perfectly Inelastic)'}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {presets.length === 0 && !isLoading && (
        <div className="text-xs text-gray-400 font-lexend text-center py-2">
          No presets available. Make sure the backend is running.
        </div>
      )}
    </div>
  );
};

export default PresetSelector; 