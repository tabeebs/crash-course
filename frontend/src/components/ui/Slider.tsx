/**
 * Reusable Slider component with cyberpunk styling.
 */

import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = '',
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-tektur text-gray-300">
          {label}
        </label>
        <span className="text-sm font-lexend text-crash-red">
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      
      <div className="relative">
        {/* Track background */}
        <div className="w-full h-2 bg-gray-800 rounded-lg">
          {/* Filled portion */}
          <div 
            className="h-full bg-crash-red rounded-lg transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            absolute top-0 w-full h-2 appearance-none bg-transparent cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-crash-red
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-crash-red-bright
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-crash-red/50
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            hover:[&::-webkit-slider-thumb]:scale-110
            hover:[&::-webkit-slider-thumb]:shadow-crash-red/80
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-crash-red
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-crash-red-bright
            [&::-moz-range-thumb]:cursor-pointer
            ${disabled ? '[&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:border-gray-500' : ''}
            ${disabled ? '[&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:border-gray-500' : ''}
          `}
        />
      </div>
    </div>
  );
};

export default Slider; 