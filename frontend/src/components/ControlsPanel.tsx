/**
 * ControlsPanel component that combines all control components.
 */

import React from 'react';
import ParticleControls from './ParticleControls';
import GlobalControls from './GlobalControls';
import SimulationControls from './SimulationControls';
import DataPanel from './DataPanel';
import type { SimulationStatus } from '../hooks/useSimulationState';

interface Particle {
  id: string;
  name: string;
  mass: number;
  velocity: number;
  color: string;
}

interface CollisionData {
  particle1Before: { velocity: number; momentum: number; kineticEnergy: number };
  particle1After: { velocity: number; momentum: number; kineticEnergy: number };
  particle2Before: { velocity: number; momentum: number; kineticEnergy: number };
  particle2After: { velocity: number; momentum: number; kineticEnergy: number };
  totalMomentumBefore: number;
  totalMomentumAfter: number;
  totalKineticEnergyBefore: number;
  totalKineticEnergyAfter: number;
}

interface ControlsPanelProps {
  // Particle data
  particle1: Particle;
  particle2: Particle;
  onParticle1MassChange: (mass: number) => void;
  onParticle1VelocityChange: (velocity: number) => void;
  onParticle2MassChange: (mass: number) => void;
  onParticle2VelocityChange: (velocity: number) => void;
  
  // Global settings
  restitution: number;
  collisionType: 'elastic' | 'inelastic' | 'custom';
  onRestitutionChange: (value: number) => void;
  onCollisionTypeChange: (type: 'elastic' | 'inelastic' | 'custom') => void;
  
  // Simulation controls
  simulationStatus: SimulationStatus;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  
  // Data display
  collisionData: CollisionData | null;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  particle1,
  particle2,
  onParticle1MassChange,
  onParticle1VelocityChange,
  onParticle2MassChange,
  onParticle2VelocityChange,
  restitution,
  collisionType,
  onRestitutionChange,
  onCollisionTypeChange,
  simulationStatus,
  onPlay,
  onPause,
  onReset,
  collisionData,
}) => {
  const isRunning = simulationStatus === 'playing';

  return (
    <div className="w-full h-full p-4 bg-black/90 overflow-y-auto">
      <h2 className="text-xl font-tektur text-white mb-6 border-b border-gray-700 pb-2">
        Simulation Controls
      </h2>
      
      {/* Simulation Controls - Always at top */}
      <div className="mb-6">
        <SimulationControls
          status={simulationStatus}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
        />
      </div>

      {/* Particle Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-tektur text-gray-300 mb-4">
          Particle Settings
        </h3>
        
        <ParticleControls
          particleId={particle1.id}
          particleName={particle1.name}
          mass={particle1.mass}
          velocity={particle1.velocity}
          color={particle1.color}
          onMassChange={onParticle1MassChange}
          onVelocityChange={onParticle1VelocityChange}
          disabled={isRunning}
        />
        
        <ParticleControls
          particleId={particle2.id}
          particleName={particle2.name}
          mass={particle2.mass}
          velocity={particle2.velocity}
          color={particle2.color}
          onMassChange={onParticle2MassChange}
          onVelocityChange={onParticle2VelocityChange}
          disabled={isRunning}
        />
      </div>

      {/* Global Controls */}
      <div className="mb-6">
        <GlobalControls
          restitution={restitution}
          collisionType={collisionType}
          onRestitutionChange={onRestitutionChange}
          onCollisionTypeChange={onCollisionTypeChange}
          disabled={isRunning}
        />
      </div>

      {/* Data Panel */}
      <div className="mb-6">
        <DataPanel
          collisionData={collisionData}
          particle1Mass={particle1.mass}
          particle2Mass={particle2.mass}
          particle1Color={particle1.color}
          particle2Color={particle2.color}
        />
      </div>
    </div>
  );
};

export default ControlsPanel; 