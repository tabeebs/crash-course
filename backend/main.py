"""
FastAPI server for the Crash Course collision simulator.

This server provides REST endpoints for collision simulation and preset scenarios.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import uvicorn

from collision_engine import simulate_collision, ParticleState, CollisionResult


# Pydantic models for API requests and responses
class ParticleData(BaseModel):
    """Data for a single particle."""
    mass: float = Field(..., gt=0, le=2.0, description="Mass in kg (0.1 to 2.0)")
    velocity: float = Field(..., ge=-20.0, le=20.0, description="Velocity in m/s (-20 to +20)")


class SimulationRequest(BaseModel):
    """Request body for collision simulation."""
    particle1: ParticleData
    particle2: ParticleData
    coefficient_of_restitution: float = Field(
        1.0, ge=0.0, le=1.0, 
        description="Coefficient of restitution (0=perfectly inelastic, 1=elastic)"
    )
    collision_type: str = Field(
        "elastic", 
        description="Type of collision: 'elastic' or 'inelastic'"
    )


class ParticleStateResponse(BaseModel):
    """Response model for particle state."""
    mass: float
    velocity: float
    momentum: float
    kinetic_energy: float


class SimulationResponse(BaseModel):
    """Response body for collision simulation."""
    particle1_initial: ParticleStateResponse
    particle2_initial: ParticleStateResponse
    particle1_final: ParticleStateResponse
    particle2_final: ParticleStateResponse
    total_momentum_initial: float
    total_momentum_final: float
    total_kinetic_energy_initial: float
    total_kinetic_energy_final: float
    kinetic_energy_change: float
    coefficient_of_restitution: float


class PresetScenario(BaseModel):
    """A preset collision scenario."""
    name: str
    description: str
    particle1: ParticleData
    particle2: ParticleData
    coefficient_of_restitution: float
    collision_type: str


# Create FastAPI app
app = FastAPI(
    title="Crash Course Collision Simulator API",
    description="Physics engine for 2-body collision simulations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Predefined collision scenarios
PRESET_SCENARIOS: List[PresetScenario] = [
    PresetScenario(
        name="Equal Mass – Head-On",
        description="Two particles of equal mass colliding head-on",
        particle1=ParticleData(mass=1.0, velocity=5.0),
        particle2=ParticleData(mass=1.0, velocity=-5.0),
        coefficient_of_restitution=1.0,
        collision_type="elastic"
    ),
    PresetScenario(
        name="Heavy vs Light",
        description="Heavy particle colliding with lighter one",
        particle1=ParticleData(mass=2.0, velocity=3.0),
        particle2=ParticleData(mass=0.5, velocity=0.0),
        coefficient_of_restitution=1.0,
        collision_type="elastic"
    ),
    PresetScenario(
        name="Perfectly Inelastic",
        description="Two particles sticking together after collision",
        particle1=ParticleData(mass=1.5, velocity=8.0),
        particle2=ParticleData(mass=1.0, velocity=-2.0),
        coefficient_of_restitution=0.0,
        collision_type="inelastic"
    ),
    PresetScenario(
        name="Partial Inelastic",
        description="Collision with some energy loss",
        particle1=ParticleData(mass=1.2, velocity=6.0),
        particle2=ParticleData(mass=0.8, velocity=-3.0),
        coefficient_of_restitution=0.5,
        collision_type="inelastic"
    ),
    PresetScenario(
        name="Stationary Target",
        description="Moving particle hits stationary target",
        particle1=ParticleData(mass=1.0, velocity=10.0),
        particle2=ParticleData(mass=1.5, velocity=0.0),
        coefficient_of_restitution=1.0,
        collision_type="elastic"
    )
]


def particle_state_to_response(state: ParticleState) -> ParticleStateResponse:
    """Convert ParticleState to response model."""
    return ParticleStateResponse(
        mass=state.mass,
        velocity=state.velocity,
        momentum=state.momentum,
        kinetic_energy=state.kinetic_energy
    )


def collision_result_to_response(result: CollisionResult) -> SimulationResponse:
    """Convert CollisionResult to response model."""
    return SimulationResponse(
        particle1_initial=particle_state_to_response(result.particle1_initial),
        particle2_initial=particle_state_to_response(result.particle2_initial),
        particle1_final=particle_state_to_response(result.particle1_final),
        particle2_final=particle_state_to_response(result.particle2_final),
        total_momentum_initial=result.total_momentum_initial,
        total_momentum_final=result.total_momentum_final,
        total_kinetic_energy_initial=result.total_kinetic_energy_initial,
        total_kinetic_energy_final=result.total_kinetic_energy_final,
        kinetic_energy_change=result.kinetic_energy_change,
        coefficient_of_restitution=result.coefficient_of_restitution
    )


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Crash Course Collision Simulator API",
        "version": "1.0.0",
        "endpoints": {
            "simulate": "POST /simulate - Run collision simulation",
            "presets": "GET /presets - Get preset scenarios",
            "docs": "GET /docs - API documentation"
        }
    }


@app.post("/simulate", response_model=SimulationResponse)
async def simulate_collision_endpoint(request: SimulationRequest):
    """
    Simulate a collision between two particles.
    
    Args:
        request: Simulation parameters including particle data and collision type
        
    Returns:
        Complete simulation results with before/after states
    """
    try:
        # Determine coefficient of restitution based on collision type
        if request.collision_type.lower() == "elastic":
            e = 1.0
        elif request.collision_type.lower() == "inelastic":
            e = 0.0
        else:
            # Use the provided coefficient of restitution
            e = request.coefficient_of_restitution
        
        # Run the collision simulation
        result = simulate_collision(
            m1=request.particle1.mass,
            v1=request.particle1.velocity,
            m2=request.particle2.mass,
            v2=request.particle2.velocity,
            e=e
        )
        
        # Convert to response format
        return collision_result_to_response(result)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")


@app.get("/presets", response_model=List[PresetScenario])
async def get_presets():
    """
    Get a list of predefined collision scenarios.
    
    Returns:
        List of preset scenarios with particle configurations
    """
    return PRESET_SCENARIOS


@app.get("/presets/{preset_name}", response_model=PresetScenario)
async def get_preset_by_name(preset_name: str):
    """
    Get a specific preset scenario by name.
    
    Args:
        preset_name: Name of the preset scenario
        
    Returns:
        The requested preset scenario
    """
    # Find preset by name (case-insensitive)
    for preset in PRESET_SCENARIOS:
        if preset.name.lower().replace(" ", "-") == preset_name.lower():
            return preset
    
    raise HTTPException(status_code=404, detail=f"Preset '{preset_name}' not found")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 