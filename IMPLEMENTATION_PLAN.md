# Crash Course - Implementation Plan

This document outlines the development plan for the "Crash Course" interactive collision simulator. The project is divided into several phases, with detailed steps for implementation.

---

### Phase 0: Project Setup & Foundation

This phase covers the initial setup of the development environment, project structure, and version control.

- [ ] Initialize a new Git repository.
- [ ] Create a monorepo structure with `frontend` and `backend` directories.
- [ ] **Backend Setup**:
    - [ ] Set up a Python virtual environment inside the `backend` directory.
    - [ ] Initialize a `pip` project with a `requirements.txt` file.
    - [ ] Add initial dependencies: `fastapi`, `uvicorn`, `numpy`.
- [ ] **Frontend Setup**:
    - [ ] Initialize a new React application using Vite inside the `frontend` directory.
    - [ ] Install and configure Tailwind CSS for the React project.
- [ ] **Fonts & Assets**:
    - [ ] Add 'Tektur' and 'Lexend' fonts from Google Fonts to the project.
    - [ ] Configure fonts in the Tailwind CSS configuration.
- [ ] Define a comprehensive `.gitignore` file for both frontend and backend (e.g., `node_modules`, `__pycache__`, `venv`, `dist`).

---

### Phase 1: Backend Development (Physics Engine & API)

This phase focuses on building the core physics logic and exposing it through a web API.

- [ ] **Collision Engine Module (`collision_engine.py`)**:
    - [ ] Create a Python module to encapsulate all physics calculations. Note: The simulation will be 1D (horizontal motion) as per the provided formulas, visualized on a 2D canvas.
    - [ ] Implement a function to calculate post-collision velocities based on the general restitution formula.
    - [ ] Add functions to calculate momentum (`p = mv`) and kinetic energy (`KE = 0.5 * mv²`).
    - [ ] Structure the engine to accept particle masses, initial velocities, and the coefficient of restitution (`e`) as input.
    - [ ] The engine should return a structured object containing initial and final states for both particles (velocity, momentum, KE) and a summary of total momentum and KE change.
- [ ] **FastAPI Server (`main.py`)**:
    - [ ] Set up a basic FastAPI application.
    - [ ] Define Pydantic models for the `/simulate` request body and response structure.
    - [ ] Create the `/simulate` POST endpoint to receive particle properties, call the collision engine, and return the full results.
    - [ ] Create the `/presets` GET endpoint to return a list of pre-defined simulation scenarios (e.g., "Equal Mass – Head-On").
    - [ ] Configure CORS (Cross-Origin Resource Sharing) middleware to allow requests from the frontend.

---

### Phase 2: Frontend - Landing Page

This phase involves building the static, visually appealing landing page.

- [ ] **Component Structure**:
    - [ ] Create a `LandingPage` component that will live at the `/` route.
    - [ ] Create a `Footer` component.
- [ ] **Styling (Tailwind CSS)**:
    - [ ] Implement the black background and futuristic theme.
    - [ ] Style the "CRASH COURSE" title and subtitle using the Tektur font.
    - [ ] Create the "Try Now" button with its specific black background, red (`#e12726`) outline, and text style.
    - [ ] Implement the smooth hover effect for the button, transitioning its background to red.
    - [ ] Style the footer with the "2025 © Shafquat Tabeeb" text using the Lexend font and red (`#ff0000`) color.
- [ ] **Routing & Transitions**:
    - [ ] Set up React Router for navigation between the landing page (`/`) and the simulator (`/simulator`).
    - [ ] Plan and implement the cyberpunk-themed glitch transition upon clicking the "Try Now" button.

---

### Phase 3: Frontend - Simulator Core (Canvas & Rendering)

This phase focuses on setting up the interactive canvas where the simulation runs.

- [ ] **Simulator Page Structure**:
    - [ ] Create a `SimulatorPage` component.
    - [ ] Design the responsive two-panel layout (canvas left/top, controls right/bottom) using Tailwind CSS.
- [ ] **Canvas Component**:
    - [ ] Create a `Canvas` component using the HTML5 `<canvas>` element.
    - [ ] Create a custom hook (e.g., `useCanvasAnimation`) to manage the `requestAnimationFrame` loop for 60fps animation.
- [ ] **Rendering Logic**:
    - [ ] Implement a function to draw the background grid on the canvas.
    - [ ] Create a `Particle` class or object factory to manage particle state (position, velocity, mass, radius).
    - [ ] Implement a function to draw particles, ensuring their radius is proportional to their mass.
    - [ ] Implement drag-and-drop functionality for users to set the initial position of particles on the canvas.
- [ ] **Animation Loop**:
    - [ ] On "Play", the loop should update particle positions based on velocity.
    - [ ] Implement 1D collision detection (when particle positions overlap).
    - [ ] After a collision is detected, the animation should use the new velocities calculated by the physics engine.

---

### Phase 4: Frontend - Simulator UI & Controls

This phase involves building the interactive UI elements that allow the user to control the simulation.

- [ ] **Control Panel Components**:
    - [ ] Create a `ControlsPanel` component.
    - [ ] Create reusable `Slider` and `Tab` or `Accordion` components.
    - [ ] Create a `ParticleControls` component for each particle, containing sliders for Mass and Initial Velocity.
    - [ ] Create a `GlobalControls` component for the Coefficient of Restitution slider and Collision Type selector (Elastic/Inelastic).
- [ ] **Simulation Controls**:
    - [ ] Create a `SimulationControls` component for the Play, Pause, and Reset buttons.
    - [ ] Ensure the Play button smoothly animates into a Pause button and vice-versa.
    - [ ] Implement the functionality for all three buttons (start, stop, and reset simulation).
- [ ] **Data Read-out Panel**:
    - [ ] Create a `DataPanel` component.
    - [ ] Display "Before" and "After" collision data (velocities, momentum, KE) for each particle.
    - [ ] Include a summary section for total momentum and the change in total kinetic energy.

---

### Phase 5: Frontend - State Management & API Integration

This phase connects the UI, canvas, and backend into a cohesive application.

- [ ] **State Management (React Hooks)**:
    - [ ] Use `useState` and `useReducer` to manage the state of the entire simulation (particle properties, simulation status like 'idle', 'playing', 'paused').
    - [ ] Ensure that adjusting a UI control (e.g., a mass slider) updates the global state, which in turn updates the particle's appearance on the canvas in real-time.
- [ ] **API Integration**:
    - [ ] When the user clicks "Play", send the current particle and simulation settings to the `/simulate` backend endpoint.
    - [ ] Receive the calculated "before" and "after" data from the API.
    - [ ] Store this data in the frontend state.
    - [ ] Use the returned post-collision velocities to update the animation after the impact.
    - [ ] Fetch and display presets from the `/presets` endpoint.
- [ ] **Data Flow**:
    - [ ] On "Play" -> `API Call` -> `Update State with API response` -> `Start Animation`.
    - [ ] `Animation Loop` -> `Detect Collision` -> `Switch to post-collision velocities from state`.
    - [ ] `Update DataPanel` with the full results from the state.

---

### Phase 6: Final Touches & Deployment

This final phase is for polishing, testing, and preparing the project for the web.

- [ ] **Responsiveness & UX**:
    - [ ] Thoroughly test and refine the responsive design on various screen sizes (desktop, tablet, mobile).
    - [ ] Ensure all pop-ups and state changes are accompanied by smooth animations.
    - [ ] Polish the cyberpunk glitch transition for a high-quality feel.
- [ ] **Testing**:
    - [ ] Manually test all functionality: sliders, buttons, animations, and API communication.
    - [ ] Verify that the physics calculations are correct by comparing them with manual calculations for a few test cases.
    - [ ] Cross-browser compatibility testing (Chrome, Firefox, Safari).
- [ ] **Build & Deployment**:
    - [ ] Create optimized production builds for both the frontend and backend.
    - [ ] Plan a deployment strategy (e.g., using Vercel/Netlify for the frontend and a service like Render/Heroku for the backend).
    - [ ] Write a `README.md` with instructions on how to set up and run the project locally. 