/**
 * SimulationControls component for play, pause, and reset functionality.
 */

import React from 'react';

interface SimulationControlsProps {
  status: 'idle' | 'playing' | 'paused' | 'completed';
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  status,
  onPlay,
  onPause,
  onReset,
}) => {
  const isPlaying = status === 'playing';
  const canPlay = status === 'idle' || status === 'paused' || status === 'completed';
  const canPause = status === 'playing';
  const canReset = status !== 'idle';

  return (
    <div className="flex items-center justify-center space-x-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
      {/* Play/Pause Button */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={!canPlay && !canPause}
        className={`
          relative w-16 h-16 rounded-full border-2 transition-all duration-300
          ${isPlaying 
            ? 'bg-crash-red/20 border-crash-red hover:bg-crash-red/30' 
            : 'bg-green-600/20 border-green-500 hover:bg-green-600/30'
          }
          ${(!canPlay && !canPause) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
          ${isPlaying ? 'focus:ring-crash-red' : 'focus:ring-green-500'}
          active:scale-95
        `}
        aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
      >
        {/* Play Icon */}
        <div 
          className={`
            absolute inset-0 flex items-center justify-center transition-all duration-300
            ${isPlaying ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}
          `}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="text-green-500 ml-1"
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>

        {/* Pause Icon */}
        <div 
          className={`
            absolute inset-0 flex items-center justify-center transition-all duration-300
            ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="text-crash-red"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        </div>
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        disabled={!canReset}
        className={`
          w-12 h-12 rounded-full border-2 border-gray-500 bg-gray-700/20
          transition-all duration-300
          ${canReset 
            ? 'hover:bg-gray-600/30 hover:border-gray-400 cursor-pointer' 
            : 'opacity-50 cursor-not-allowed'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500
          active:scale-95
        `}
        aria-label="Reset simulation"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="text-gray-400 mx-auto"
        >
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>

      {/* Status Text */}
      <div className="ml-4">
        <div className="text-sm font-tektur text-gray-300">
          Status
        </div>
        <div className={`text-xs font-lexend ${
          status === 'playing' ? 'text-green-400' :
          status === 'paused' ? 'text-yellow-400' :
          status === 'completed' ? 'text-blue-400' :
          'text-gray-400'
        }`}>
          {status === 'idle' && 'Ready'}
          {status === 'playing' && 'Running'}
          {status === 'paused' && 'Paused'}
          {status === 'completed' && 'Complete'}
        </div>
      </div>
    </div>
  );
};

export default SimulationControls; 