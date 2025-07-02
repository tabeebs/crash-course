/**
 * SimulatorPage component - main simulation interface with integrated state management.
 */

import React from 'react';
import EnhancedCanvas from './EnhancedCanvas';
import ControlsPanel from './ControlsPanel';
import PresetSelector from './PresetSelector';
import { useSimulation } from '../hooks/useSimulation';

const SimulatorPage: React.FC = () => {
  const simulation = useSimulation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Error Banner */}
      {simulation.error && (
        <div className="bg-crash-red/10 border-b border-crash-red/30 px-4 py-2">
          <div className="text-crash-red text-sm font-lexend text-center">
            ⚠ {simulation.error}
          </div>
        </div>
      )}

      {/* Desktop Layout: Side by side */}
      <div className="hidden lg:flex h-screen">
        {/* Canvas Panel - Left */}
        <div className="flex-1 p-4 border-r border-gray-800">
          <EnhancedCanvas
            particle1={simulation.particle1}
            particle2={simulation.particle2}
            status={simulation.status}
            collisionData={simulation.collisionData}
            onParticle1PositionChange={simulation.updateParticle1Position}
            onParticle2PositionChange={simulation.updateParticle2Position}
          />
        </div>
        
        {/* Controls Panel - Right */}
        <div className="w-96 p-4 bg-gray-900 overflow-y-auto">
          <div className="space-y-4">
            
            {/* Preset Selector */}
            <PresetSelector
              onLoadPreset={simulation.loadPreset}
              fetchPresets={simulation.fetchPresets}
              disabled={simulation.status === 'playing' || simulation.isLoading}
            />

            {/* Main Controls Panel */}
            <ControlsPanel
              particle1={simulation.particle1}
              particle2={simulation.particle2}
              onParticle1MassChange={simulation.updateParticle1Mass}
              onParticle1VelocityChange={simulation.updateParticle1Velocity}
              onParticle2MassChange={simulation.updateParticle2Mass}
              onParticle2VelocityChange={simulation.updateParticle2Velocity}
              restitution={simulation.restitution}
              collisionType={simulation.collisionType}
              onRestitutionChange={simulation.updateRestitution}
              onCollisionTypeChange={simulation.updateCollisionType}
              simulationStatus={simulation.status}
              onPlay={simulation.startSimulation}
              onPause={simulation.pauseSimulation}
              onReset={simulation.resetSimulation}
              collisionData={simulation.collisionData}
            />

          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout: Stacked */}
      <div className="lg:hidden flex flex-col h-screen">
        {/* Canvas Panel - Top */}
        <div className="flex-1 p-2 border-b border-gray-800">
          <EnhancedCanvas
            width={350}
            height={250}
            particle1={simulation.particle1}
            particle2={simulation.particle2}
            status={simulation.status}
            collisionData={simulation.collisionData}
            onParticle1PositionChange={simulation.updateParticle1Position}
            onParticle2PositionChange={simulation.updateParticle2Position}
          />
        </div>
        
        {/* Controls Panel - Bottom */}
        <div className="h-80 p-2 bg-gray-900 overflow-y-auto">
          <div className="space-y-3">
            
            {/* Preset Selector */}
            <PresetSelector
              onLoadPreset={simulation.loadPreset}
              fetchPresets={simulation.fetchPresets}
              disabled={simulation.status === 'playing' || simulation.isLoading}
            />

            {/* Compact Controls Panel */}
            <ControlsPanel
              particle1={simulation.particle1}
              particle2={simulation.particle2}
              onParticle1MassChange={simulation.updateParticle1Mass}
              onParticle1VelocityChange={simulation.updateParticle1Velocity}
              onParticle2MassChange={simulation.updateParticle2Mass}
              onParticle2VelocityChange={simulation.updateParticle2Velocity}
              restitution={simulation.restitution}
              collisionType={simulation.collisionType}
              onRestitutionChange={simulation.updateRestitution}
              onCollisionTypeChange={simulation.updateCollisionType}
              simulationStatus={simulation.status}
              onPlay={simulation.startSimulation}
              onPause={simulation.pauseSimulation}
              onReset={simulation.resetSimulation}
              collisionData={simulation.collisionData}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage; 