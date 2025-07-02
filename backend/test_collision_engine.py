"""
Tests for the collision engine module.
"""

import pytest
import numpy as np
from collision_engine import (
    calculate_momentum,
    calculate_kinetic_energy,
    create_particle_state,
    calculate_collision_velocities,
    simulate_collision,
    ParticleState,
    CollisionResult
)


class TestBasicCalculations:
    """Test basic physics calculations."""
    
    def test_calculate_momentum(self):
        """Test momentum calculation: p = mv"""
        assert calculate_momentum(2.0, 5.0) == 10.0
        assert calculate_momentum(1.5, -3.0) == -4.5
        assert calculate_momentum(0.5, 0.0) == 0.0
    
    def test_calculate_kinetic_energy(self):
        """Test kinetic energy calculation: KE = ½mv²"""
        assert calculate_kinetic_energy(2.0, 4.0) == 16.0  # ½ * 2 * 16
        assert calculate_kinetic_energy(1.0, -3.0) == 4.5  # ½ * 1 * 9
        assert calculate_kinetic_energy(2.0, 0.0) == 0.0
    
    def test_create_particle_state(self):
        """Test particle state creation with calculated properties."""
        state = create_particle_state(2.0, 3.0)
        
        assert state.mass == 2.0
        assert state.velocity == 3.0
        assert state.momentum == 6.0  # 2 * 3
        assert state.kinetic_energy == 9.0  # ½ * 2 * 9


class TestCollisionVelocities:
    """Test collision velocity calculations."""
    
    def test_elastic_collision_equal_masses(self):
        """Test elastic collision with equal masses - velocities should swap."""
        m1, v1 = 1.0, 5.0
        m2, v2 = 1.0, -3.0
        e = 1.0  # Elastic
        
        v1_final, v2_final = calculate_collision_velocities(m1, v1, m2, v2, e)
        
        # For equal masses in elastic collision, velocities swap
        assert abs(v1_final - (-3.0)) < 1e-10
        assert abs(v2_final - 5.0) < 1e-10
    
    def test_elastic_collision_different_masses(self):
        """Test elastic collision with different masses."""
        m1, v1 = 2.0, 4.0
        m2, v2 = 1.0, -2.0
        e = 1.0  # Elastic
        
        v1_final, v2_final = calculate_collision_velocities(m1, v1, m2, v2, e)
        
        # Check momentum conservation
        initial_momentum = m1 * v1 + m2 * v2
        final_momentum = m1 * v1_final + m2 * v2_final
        assert abs(initial_momentum - final_momentum) < 1e-10
        
        # Check energy conservation for elastic collision
        initial_ke = 0.5 * m1 * v1**2 + 0.5 * m2 * v2**2
        final_ke = 0.5 * m1 * v1_final**2 + 0.5 * m2 * v2_final**2
        assert abs(initial_ke - final_ke) < 1e-10
    
    def test_perfectly_inelastic_collision(self):
        """Test perfectly inelastic collision (e=0)."""
        m1, v1 = 3.0, 6.0
        m2, v2 = 2.0, -4.0
        e = 0.0  # Perfectly inelastic
        
        v1_final, v2_final = calculate_collision_velocities(m1, v1, m2, v2, e)
        
        # Both particles should have the same final velocity
        assert abs(v1_final - v2_final) < 1e-10
        
        # Final velocity should be (m1*v1 + m2*v2)/(m1+m2)
        expected_velocity = (m1 * v1 + m2 * v2) / (m1 + m2)
        assert abs(v1_final - expected_velocity) < 1e-10
    
    def test_partial_inelastic_collision(self):
        """Test partial inelastic collision (0 < e < 1)."""
        m1, v1 = 2.0, 8.0
        m2, v2 = 1.0, 2.0
        e = 0.5  # Partial inelastic
        
        v1_final, v2_final = calculate_collision_velocities(m1, v1, m2, v2, e)
        
        # Check momentum conservation
        initial_momentum = m1 * v1 + m2 * v2
        final_momentum = m1 * v1_final + m2 * v2_final
        assert abs(initial_momentum - final_momentum) < 1e-10
        
        # Final kinetic energy should be less than initial (energy lost)
        initial_ke = 0.5 * m1 * v1**2 + 0.5 * m2 * v2**2
        final_ke = 0.5 * m1 * v1_final**2 + 0.5 * m2 * v2_final**2
        assert final_ke < initial_ke
    
    def test_collision_validation(self):
        """Test input validation for collision calculations."""
        # Test negative masses
        with pytest.raises(ValueError, match="Masses must be positive"):
            calculate_collision_velocities(-1.0, 5.0, 2.0, 3.0)
        
        with pytest.raises(ValueError, match="Masses must be positive"):
            calculate_collision_velocities(1.0, 5.0, 0.0, 3.0)
        
        # Test invalid coefficient of restitution
        with pytest.raises(ValueError, match="Coefficient of restitution must be between 0 and 1"):
            calculate_collision_velocities(1.0, 5.0, 2.0, 3.0, -0.1)
        
        with pytest.raises(ValueError, match="Coefficient of restitution must be between 0 and 1"):
            calculate_collision_velocities(1.0, 5.0, 2.0, 3.0, 1.5)


class TestCompleteSimulation:
    """Test complete collision simulation."""
    
    def test_simulate_elastic_collision(self):
        """Test complete elastic collision simulation."""
        m1, v1 = 2.0, 6.0
        m2, v2 = 1.0, -2.0
        e = 1.0
        
        result = simulate_collision(m1, v1, m2, v2, e)
        
        # Check that result is a CollisionResult
        assert isinstance(result, CollisionResult)
        
        # Check initial states
        assert result.particle1_initial.mass == m1
        assert result.particle1_initial.velocity == v1
        assert result.particle2_initial.mass == m2
        assert result.particle2_initial.velocity == v2
        
        # Check momentum conservation
        assert abs(result.total_momentum_initial - result.total_momentum_final) < 1e-10
        
        # Check energy conservation for elastic collision
        assert abs(result.kinetic_energy_change) < 1e-10
        
        # Check coefficient of restitution
        assert result.coefficient_of_restitution == e
    
    def test_simulate_inelastic_collision(self):
        """Test complete inelastic collision simulation."""
        m1, v1 = 3.0, 8.0
        m2, v2 = 2.0, 2.0
        e = 0.0
        
        result = simulate_collision(m1, v1, m2, v2, e)
        
        # Check momentum conservation
        assert abs(result.total_momentum_initial - result.total_momentum_final) < 1e-10
        
        # Check energy loss for inelastic collision
        assert result.kinetic_energy_change < 0
        
        # Check that final velocities are equal
        assert abs(result.particle1_final.velocity - result.particle2_final.velocity) < 1e-10
    
    def test_simulate_stationary_collision(self):
        """Test collision where one particle is initially stationary."""
        m1, v1 = 2.0, 10.0
        m2, v2 = 1.0, 0.0
        e = 1.0
        
        result = simulate_collision(m1, v1, m2, v2, e)
        
        # Check momentum conservation
        assert abs(result.total_momentum_initial - result.total_momentum_final) < 1e-10
        
        # Check energy conservation for elastic collision
        assert abs(result.kinetic_energy_change) < 1e-10
        
        # The moving particle should slow down, stationary should speed up
        assert result.particle1_final.velocity < result.particle1_initial.velocity
        assert result.particle2_final.velocity > result.particle2_initial.velocity


class TestPhysicsValidation:
    """Test physics principles validation."""
    
    @pytest.mark.parametrize("m1,v1,m2,v2,e", [
        (1.0, 5.0, 2.0, -3.0, 1.0),    # Elastic
        (2.0, 8.0, 1.5, 2.0, 0.0),     # Perfectly inelastic
        (1.5, 6.0, 2.5, -4.0, 0.7),    # Partial inelastic
        (0.5, 12.0, 3.0, 0.0, 0.3),    # One stationary
    ])
    def test_momentum_conservation(self, m1, v1, m2, v2, e):
        """Test that momentum is always conserved regardless of collision type."""
        result = simulate_collision(m1, v1, m2, v2, e)
        
        momentum_diff = abs(result.total_momentum_initial - result.total_momentum_final)
        assert momentum_diff < 1e-10, f"Momentum not conserved: {momentum_diff}"
    
    def test_energy_conservation_elastic(self):
        """Test that kinetic energy is conserved in elastic collisions."""
        result = simulate_collision(2.0, 4.0, 1.0, -2.0, 1.0)
        
        assert abs(result.kinetic_energy_change) < 1e-10
    
    def test_energy_loss_inelastic(self):
        """Test that kinetic energy is lost in inelastic collisions."""
        result = simulate_collision(2.0, 4.0, 1.0, -2.0, 0.5)
        
        assert result.kinetic_energy_change < 0 