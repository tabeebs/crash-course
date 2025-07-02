"""
Tests for the FastAPI server endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from main import app, PRESET_SCENARIOS


@pytest.fixture
def client():
    """Create a test client for FastAPI."""
    return TestClient(app)


class TestRootEndpoint:
    """Test the root endpoint."""
    
    def test_root_endpoint(self, client):
        """Test the root endpoint returns API information."""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["message"] == "Crash Course Collision Simulator API"
        assert data["version"] == "1.0.0"
        assert "endpoints" in data


class TestSimulateEndpoint:
    """Test the collision simulation endpoint."""
    
    def test_simulate_elastic_collision(self, client):
        """Test elastic collision simulation."""
        request_data = {
            "particle1": {
                "mass": 1.0,
                "velocity": 5.0
            },
            "particle2": {
                "mass": 1.0,
                "velocity": -3.0
            },
            "coefficient_of_restitution": 1.0,
            "collision_type": "elastic"
        }
        
        response = client.post("/simulate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        
        # Check that all expected fields are present
        assert "particle1_initial" in data
        assert "particle2_initial" in data
        assert "particle1_final" in data
        assert "particle2_final" in data
        assert "total_momentum_initial" in data
        assert "total_momentum_final" in data
        assert "kinetic_energy_change" in data
        
        # Check momentum conservation
        momentum_diff = abs(data["total_momentum_initial"] - data["total_momentum_final"])
        assert momentum_diff < 1e-10
        
        # Check energy conservation for elastic collision
        assert abs(data["kinetic_energy_change"]) < 1e-10
    
    def test_simulate_inelastic_collision(self, client):
        """Test inelastic collision simulation."""
        request_data = {
            "particle1": {
                "mass": 2.0,
                "velocity": 6.0
            },
            "particle2": {
                "mass": 1.0,
                "velocity": -2.0
            },
            "coefficient_of_restitution": 0.0,
            "collision_type": "inelastic"
        }
        
        response = client.post("/simulate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        
        # Check momentum conservation
        momentum_diff = abs(data["total_momentum_initial"] - data["total_momentum_final"])
        assert momentum_diff < 1e-10
        
        # Check energy loss for inelastic collision
        assert data["kinetic_energy_change"] < 0
        
        # Check that final velocities are equal for perfectly inelastic collision
        v1_final = data["particle1_final"]["velocity"]
        v2_final = data["particle2_final"]["velocity"]
        assert abs(v1_final - v2_final) < 1e-10
    
    def test_simulate_partial_inelastic(self, client):
        """Test partial inelastic collision simulation."""
        request_data = {
            "particle1": {
                "mass": 1.5,
                "velocity": 8.0
            },
            "particle2": {
                "mass": 1.0,
                "velocity": 2.0
            },
            "coefficient_of_restitution": 0.7,
            "collision_type": "custom"
        }
        
        response = client.post("/simulate", json=request_data)
        assert response.status_code == 200
        
        data = response.json()
        
        # Check momentum conservation
        momentum_diff = abs(data["total_momentum_initial"] - data["total_momentum_final"])
        assert momentum_diff < 1e-10
        
        # Check that some energy is lost
        assert data["kinetic_energy_change"] < 0
        
        # Check coefficient of restitution is preserved
        assert data["coefficient_of_restitution"] == 0.7
    
    def test_simulate_invalid_mass(self, client):
        """Test simulation with invalid mass values."""
        request_data = {
            "particle1": {
                "mass": -1.0,  # Invalid negative mass
                "velocity": 5.0
            },
            "particle2": {
                "mass": 1.0,
                "velocity": -3.0
            },
            "coefficient_of_restitution": 1.0,
            "collision_type": "elastic"
        }
        
        response = client.post("/simulate", json=request_data)
        assert response.status_code == 422  # Validation error
    
    def test_simulate_invalid_velocity(self, client):
        """Test simulation with out-of-range velocity."""
        request_data = {
            "particle1": {
                "mass": 1.0,
                "velocity": 25.0  # Out of range (-20 to +20)
            },
            "particle2": {
                "mass": 1.0,
                "velocity": -3.0
            },
            "coefficient_of_restitution": 1.0,
            "collision_type": "elastic"
        }
        
        response = client.post("/simulate", json=request_data)
        assert response.status_code == 422  # Validation error
    
    def test_simulate_invalid_restitution(self, client):
        """Test simulation with invalid coefficient of restitution."""
        request_data = {
            "particle1": {
                "mass": 1.0,
                "velocity": 5.0
            },
            "particle2": {
                "mass": 1.0,
                "velocity": -3.0
            },
            "coefficient_of_restitution": 1.5,  # Invalid > 1
            "collision_type": "custom"
        }
        
        response = client.post("/simulate", json=request_data)
        assert response.status_code == 422  # Validation error


class TestPresetsEndpoint:
    """Test the presets endpoints."""
    
    def test_get_all_presets(self, client):
        """Test getting all preset scenarios."""
        response = client.get("/presets")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == len(PRESET_SCENARIOS)
        
        # Check that each preset has required fields
        for preset in data:
            assert "name" in preset
            assert "description" in preset
            assert "particle1" in preset
            assert "particle2" in preset
            assert "coefficient_of_restitution" in preset
            assert "collision_type" in preset
    
    def test_get_preset_by_name(self, client):
        """Test getting a specific preset by name."""
        # Test with the first preset
        preset_name = "equal-mass-–-head-on"  # URL-friendly version
        response = client.get(f"/presets/{preset_name}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Equal Mass – Head-On"
        assert "particle1" in data
        assert "particle2" in data
    
    def test_get_nonexistent_preset(self, client):
        """Test getting a preset that doesn't exist."""
        response = client.get("/presets/nonexistent-preset")
        assert response.status_code == 404
        
        data = response.json()
        assert "not found" in data["detail"].lower()


class TestAPIValidation:
    """Test API validation and error handling."""
    
    def test_missing_required_fields(self, client):
        """Test request with missing required fields."""
        request_data = {
            "particle1": {
                "mass": 1.0
                # Missing velocity
            },
            "particle2": {
                "mass": 1.0,
                "velocity": -3.0
            }
        }
        
        response = client.post("/simulate", json=request_data)
        assert response.status_code == 422
    
    def test_invalid_json(self, client):
        """Test request with invalid JSON."""
        response = client.post("/simulate", data="invalid json")
        assert response.status_code == 422
    
    def test_empty_request(self, client):
        """Test request with empty body."""
        response = client.post("/simulate", json={})
        assert response.status_code == 422


class TestPhysicsValidation:
    """Test that the API correctly validates physics principles."""
    
    def test_momentum_conservation_various_scenarios(self, client):
        """Test momentum conservation across different scenarios."""
        scenarios = [
            # Equal masses, different velocities
            {
                "particle1": {"mass": 1.0, "velocity": 8.0},
                "particle2": {"mass": 1.0, "velocity": -2.0},
                "collision_type": "elastic"
            },
            # Different masses
            {
                "particle1": {"mass": 2.0, "velocity": 5.0},
                "particle2": {"mass": 0.5, "velocity": -10.0},
                "collision_type": "elastic"
            },
            # One stationary
            {
                "particle1": {"mass": 1.5, "velocity": 12.0},
                "particle2": {"mass": 1.0, "velocity": 0.0},
                "collision_type": "inelastic"
            }
        ]
        
        for scenario in scenarios:
            response = client.post("/simulate", json=scenario)
            assert response.status_code == 200
            
            data = response.json()
            momentum_diff = abs(data["total_momentum_initial"] - data["total_momentum_final"])
            assert momentum_diff < 1e-10, f"Momentum not conserved in scenario: {scenario}" 