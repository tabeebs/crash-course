/**
 * Simulator Page component with responsive two-panel layout.
 * Canvas on left/top, controls on right/bottom.
 */

import React from 'react';
import Canvas from './Canvas';

const SimulatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop Layout: Side by side */}
      <div className="hidden lg:flex h-screen">
        {/* Canvas Panel - Left */}
        <div className="flex-1 p-4 border-r border-gray-800">
          <Canvas />
        </div>
        
        {/* Controls Panel - Right */}
        <div className="w-80 p-4 bg-gray-900">
          <h2 className="text-xl font-tektur mb-4 text-crash-red">Controls</h2>
          <div className="text-gray-300">
            Controls coming in Phase 4...
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout: Stacked */}
      <div className="lg:hidden flex flex-col h-screen">
        {/* Canvas Panel - Top */}
        <div className="flex-1 p-4 border-b border-gray-800">
          <Canvas />
        </div>
        
        {/* Controls Panel - Bottom */}
        <div className="h-64 p-4 bg-gray-900 overflow-y-auto">
          <h2 className="text-lg font-tektur mb-4 text-crash-red">Controls</h2>
          <div className="text-gray-300 text-sm">
            Controls coming in Phase 4...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage; 