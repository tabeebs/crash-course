"""
Collision Engine Module

This module handles all physics calculations for 1D particle collisions,
including elastic, inelastic, and general collisions with coefficient of restitution.
"""

import numpy as np
from typing import Dict, Any
from dataclasses import dataclass


@dataclass
class ParticleState:
    """Represents the state of a particle at a given time."""
    mass: float  # kg
    velocity: float  # m/s
    momentum: float  # kg⋅m/s
    kinetic_energy: float  # J (Joules)


@dataclass
class CollisionResult:
    """Contains the complete results of a collision simulation."""
    particle1_initial: ParticleState
    particle2_initial: ParticleState
    particle1_final: ParticleState
    particle2_final: ParticleState
    total_momentum_initial: float
    total_momentum_final: float
    total_kinetic_energy_initial: float
    total_kinetic_energy_final: float
    kinetic_energy_change: float
    coefficient_of_restitution: float


def calculate_momentum(mass: float, velocity: float) -> float:
    """
    Calculate momentum: p = mv
    
    Args:
        mass: Mass in kg
        velocity: Velocity in m/s
        
    Returns:
        Momentum in kg⋅m/s
    """
    return mass * velocity


def calculate_kinetic_energy(mass: float, velocity: float) -> float:
    """
    Calculate kinetic energy: KE = ½mv²
    
    Args:
        mass: Mass in kg
        velocity: Velocity in m/s
        
    Returns:
        Kinetic energy in Joules
    """
    return 0.5 * mass * velocity ** 2


def create_particle_state(mass: float, velocity: float) -> ParticleState:
    """
    Create a ParticleState with calculated momentum and kinetic energy.
    
    Args:
        mass: Mass in kg
        velocity: Velocity in m/s
        
    Returns:
        ParticleState with all properties calculated
    """
    momentum = calculate_momentum(mass, velocity)
    kinetic_energy = calculate_kinetic_energy(mass, velocity)
    
    return ParticleState(
        mass=mass,
        velocity=velocity,
        momentum=momentum,
        kinetic_energy=kinetic_energy
    )


def calculate_collision_velocities(
    m1: float, v1: float, m2: float, v2: float, e: float = 1.0
) -> tuple[float, float]:
    """
    Calculate post-collision velocities using the general restitution formula.
    
    For elastic collisions (e=1):
    v1' = ((m1-m2)v1 + 2m2v2) / (m1+m2)
    v2' = ((m2-m1)v2 + 2m1v1) / (m1+m2)
    
    For perfectly inelastic collisions (e=0):
    v1' = v2' = (m1v1 + m2v2) / (m1+m2)
    
    General formula with coefficient of restitution e:
    v1' = (m1v1 + m2v2 - m2*e*(v1-v2)) / (m1+m2)
    v2' = (m1v1 + m2v2 + m1*e*(v1-v2)) / (m1+m2)
    
    Args:
        m1: Mass of particle 1 (kg)
        v1: Initial velocity of particle 1 (m/s)
        m2: Mass of particle 2 (kg) 
        v2: Initial velocity of particle 2 (m/s)
        e: Coefficient of restitution (0 ≤ e ≤ 1)
        
    Returns:
        Tuple of (v1_final, v2_final) velocities
    """
    if m1 <= 0 or m2 <= 0:
        raise ValueError("Masses must be positive")
    
    if not (0 <= e <= 1):
        raise ValueError("Coefficient of restitution must be between 0 and 1")
    
    total_mass = m1 + m2
    momentum_sum = m1 * v1 + m2 * v2
    relative_velocity = v1 - v2
    
    # General collision formulas with coefficient of restitution
    v1_final = (momentum_sum - m2 * e * relative_velocity) / total_mass
    v2_final = (momentum_sum + m1 * e * relative_velocity) / total_mass
    
    return v1_final, v2_final


def simulate_collision(
    m1: float, v1: float, m2: float, v2: float, e: float = 1.0
) -> CollisionResult:
    """
    Simulate a complete collision and return all relevant data.
    
    Args:
        m1: Mass of particle 1 (kg)
        v1: Initial velocity of particle 1 (m/s)
        m2: Mass of particle 2 (kg)
        v2: Initial velocity of particle 2 (m/s)
        e: Coefficient of restitution (0 ≤ e ≤ 1)
        
    Returns:
        CollisionResult containing all initial and final states
    """
    # Create initial particle states
    particle1_initial = create_particle_state(m1, v1)
    particle2_initial = create_particle_state(m2, v2)
    
    # Calculate initial totals
    total_momentum_initial = particle1_initial.momentum + particle2_initial.momentum
    total_ke_initial = particle1_initial.kinetic_energy + particle2_initial.kinetic_energy
    
    # Calculate post-collision velocities
    v1_final, v2_final = calculate_collision_velocities(m1, v1, m2, v2, e)
    
    # Create final particle states
    particle1_final = create_particle_state(m1, v1_final)
    particle2_final = create_particle_state(m2, v2_final)
    
    # Calculate final totals
    total_momentum_final = particle1_final.momentum + particle2_final.momentum
    total_ke_final = particle1_final.kinetic_energy + particle2_final.kinetic_energy
    
    # Calculate energy change
    ke_change = total_ke_final - total_ke_initial
    
    return CollisionResult(
        particle1_initial=particle1_initial,
        particle2_initial=particle2_initial,
        particle1_final=particle1_final,
        particle2_final=particle2_final,
        total_momentum_initial=total_momentum_initial,
        total_momentum_final=total_momentum_final,
        total_kinetic_energy_initial=total_ke_initial,
        total_kinetic_energy_final=total_ke_final,
        kinetic_energy_change=ke_change,
        coefficient_of_restitution=e
    ) 