/**
 * DataPanel component for displaying collision data and results.
 */

import React from 'react';

interface ParticleData {
  velocity: number;
  momentum: number;
  kineticEnergy: number;
}

interface CollisionData {
  particle1Before: ParticleData;
  particle1After: ParticleData;
  particle2Before: ParticleData;
  particle2After: ParticleData;
  totalMomentumBefore: number;
  totalMomentumAfter: number;
  totalKineticEnergyBefore: number;
  totalKineticEnergyAfter: number;
}

interface DataPanelProps {
  collisionData: CollisionData | null;
  particle1Mass: number;
  particle2Mass: number;
  particle1Color: string;
  particle2Color: string;
}

const DataPanel: React.FC<DataPanelProps> = ({
  collisionData,
  particle1Mass,
  particle2Mass,
  particle1Color,
  particle2Color,
}) => {
  if (!collisionData) {
    return (
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
        <h3 className="text-lg font-tektur text-white mb-4">
          Collision Data
        </h3>
        <div className="text-gray-400 font-lexend text-sm text-center py-8">
          Run simulation to see collision data
        </div>
      </div>
    );
  }

  const formatValue = (value: number, unit: string = '', decimals: number = 2): string => {
    return `${value.toFixed(decimals)}${unit}`;
  };

  const energyLoss = collisionData.totalKineticEnergyBefore - collisionData.totalKineticEnergyAfter;
  const energyLossPercentage = (energyLoss / collisionData.totalKineticEnergyBefore) * 100;

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
      <h3 className="text-lg font-tektur text-white mb-4">
        Collision Data
      </h3>

      {/* Particle 1 Data */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div 
            className="w-3 h-3 rounded-full mr-2 border border-white"
            style={{ backgroundColor: particle1Color }}
          />
          <h4 className="font-tektur text-white text-sm">
            Particle 1 (m = {formatValue(particle1Mass, ' kg', 1)})
          </h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs font-lexend">
          <div>
            <div className="text-gray-400 mb-1">Before Collision</div>
            <div className="text-white">v = {formatValue(collisionData.particle1Before.velocity, ' m/s')}</div>
            <div className="text-white">p = {formatValue(collisionData.particle1Before.momentum, ' kg⋅m/s')}</div>
            <div className="text-white">KE = {formatValue(collisionData.particle1Before.kineticEnergy, ' J')}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">After Collision</div>
            <div className="text-crash-red">v = {formatValue(collisionData.particle1After.velocity, ' m/s')}</div>
            <div className="text-crash-red">p = {formatValue(collisionData.particle1After.momentum, ' kg⋅m/s')}</div>
            <div className="text-crash-red">KE = {formatValue(collisionData.particle1After.kineticEnergy, ' J')}</div>
          </div>
        </div>
      </div>

      {/* Particle 2 Data */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div 
            className="w-3 h-3 rounded-full mr-2 border border-white"
            style={{ backgroundColor: particle2Color }}
          />
          <h4 className="font-tektur text-white text-sm">
            Particle 2 (m = {formatValue(particle2Mass, ' kg', 1)})
          </h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs font-lexend">
          <div>
            <div className="text-gray-400 mb-1">Before Collision</div>
            <div className="text-white">v = {formatValue(collisionData.particle2Before.velocity, ' m/s')}</div>
            <div className="text-white">p = {formatValue(collisionData.particle2Before.momentum, ' kg⋅m/s')}</div>
            <div className="text-white">KE = {formatValue(collisionData.particle2Before.kineticEnergy, ' J')}</div>
          </div>
          <div>
            <div className="text-gray-400 mb-1">After Collision</div>
            <div className="text-crash-red">v = {formatValue(collisionData.particle2After.velocity, ' m/s')}</div>
            <div className="text-crash-red">p = {formatValue(collisionData.particle2After.momentum, ' kg⋅m/s')}</div>
            <div className="text-crash-red">KE = {formatValue(collisionData.particle2After.kineticEnergy, ' J')}</div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="pt-4 border-t border-gray-600">
        <h5 className="font-tektur text-white text-sm mb-2">Conservation Summary</h5>
        
        <div className="grid grid-cols-2 gap-4 text-xs font-lexend">
          <div>
            <div className="text-gray-400 mb-1">Total Momentum</div>
            <div className="text-white">Before: {formatValue(collisionData.totalMomentumBefore, ' kg⋅m/s')}</div>
            <div className="text-green-400">After: {formatValue(collisionData.totalMomentumAfter, ' kg⋅m/s')}</div>
            <div className={`mt-1 ${Math.abs(collisionData.totalMomentumBefore - collisionData.totalMomentumAfter) < 0.01 ? 'text-green-400' : 'text-yellow-400'}`}>
              ✓ Conserved
            </div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">Total Kinetic Energy</div>
            <div className="text-white">Before: {formatValue(collisionData.totalKineticEnergyBefore, ' J')}</div>
            <div className="text-crash-red">After: {formatValue(collisionData.totalKineticEnergyAfter, ' J')}</div>
            <div className={`mt-1 ${energyLoss < 0.01 ? 'text-green-400' : 'text-crash-red'}`}>
              {energyLoss < 0.01 ? '✓ Conserved' : `⚠ Lost: ${formatValue(energyLossPercentage, '%', 1)}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPanel; 