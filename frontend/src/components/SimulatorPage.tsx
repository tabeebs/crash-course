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
      {/* Error Banner with smooth animation */}
      <div className={`
        transition-all duration-500 ease-out
        ${simulation.error 
          ? 'max-h-20 opacity-100 translate-y-0' 
          : 'max-h-0 opacity-0 -translate-y-full overflow-hidden'
        }
        bg-crash-red/10 border-b border-crash-red/30
      `}>
        <div className="px-4 py-3 text-crash-red text-sm font-lexend text-center animate-pulse">
          ⚠ {simulation.error}
        </div>
      </div>

      {/* Large Desktop Layout: Side by side - 1200px+ */}
      <div className="hidden xl:flex h-screen">
        {/* Canvas Panel - Left */}
        <div className="flex-1 p-6 border-r border-gray-800 transition-all duration-300">
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
        <div className="w-[400px] p-6 bg-gray-900 overflow-y-auto transition-all duration-300">
          <div className="space-y-6">
            
            {/* Preset Selector */}
            <div className="transform transition-all duration-200 hover:scale-[1.02]">
              <PresetSelector
                onLoadPreset={simulation.loadPreset}
                fetchPresets={simulation.fetchPresets}
                disabled={simulation.status === 'playing' || simulation.isLoading}
              />
            </div>

            {/* Main Controls Panel */}
            <div className="transform transition-all duration-200 hover:scale-[1.01]">
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

      {/* Standard Desktop Layout: Side by side - 1024px to 1199px */}
      <div className="hidden lg:flex xl:hidden h-screen">
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
        <div className="w-80 p-4 bg-gray-900 overflow-y-auto">
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

      {/* Tablet Layout: Stacked - 768px to 1023px */}
      <div className="hidden md:flex lg:hidden flex-col h-screen">
        {/* Canvas Panel - Top */}
        <div className="flex-1 p-4 border-b border-gray-800 min-h-[60vh]">
          <EnhancedCanvas
            width={700}
            height={400}
            particle1={simulation.particle1}
            particle2={simulation.particle2}
            status={simulation.status}
            collisionData={simulation.collisionData}
            onParticle1PositionChange={simulation.updateParticle1Position}
            onParticle2PositionChange={simulation.updateParticle2Position}
          />
        </div>
        
        {/* Controls Panel - Bottom */}
        <div className="flex-1 p-4 bg-gray-900 overflow-y-auto max-h-[40vh]">
          <div className="space-y-4">
            
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

      {/* Mobile Layout: Stacked with smaller canvas - below 768px */}
      <div className="md:hidden flex flex-col h-screen">
        {/* Canvas Panel - Top */}
        <div className="flex-1 p-3 border-b border-gray-800 min-h-[50vh]">
          <EnhancedCanvas
            width={320}
            height={220}
            particle1={simulation.particle1}
            particle2={simulation.particle2}
            status={simulation.status}
            collisionData={simulation.collisionData}
            onParticle1PositionChange={simulation.updateParticle1Position}
            onParticle2PositionChange={simulation.updateParticle2Position}
          />
        </div>
        
        {/* Controls Panel - Bottom with scroll */}
        <div className="flex-1 p-3 bg-gray-900 overflow-y-auto max-h-[50vh]">
          <div className="space-y-3">
            
            {/* Preset Selector */}
            <PresetSelector
              onLoadPreset={simulation.loadPreset}
              fetchPresets={simulation.fetchPresets}
              disabled={simulation.status === 'playing' || simulation.isLoading}
            />

            {/* Very Compact Controls Panel */}
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