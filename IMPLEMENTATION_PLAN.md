# Crash Course - Implementation Plan

This document outlines the development plan for the "Crash Course" interactive collision simulator. The project is divided into several phases, with detailed steps for implementation.

---

### Phase 0: Project Setup & Foundation

This phase covers the initial setup of the development environment, project structure, and version control.

- [x] Initialize a new Git repository.
- [x] Create a monorepo structure with `frontend` and `backend` directories.
- [x] **Backend Setup**:
    - [x] Set up a Python virtual environment inside the `backend` directory.
    - [x] Initialize a `pip` project with a `requirements.txt` file.
    - [x] Add initial dependencies: `fastapi`, `uvicorn`, `numpy`.
- [x] **Frontend Setup**:
    - [x] Initialize a new React application using Vite inside the `frontend` directory.
    - [x] Install and configure Tailwind CSS for the React project.
- [x] **Fonts & Assets**:
    - [x] Add 'Tektur' and 'Lexend' fonts from Google Fonts to the project.
    - [x] Configure fonts in the Tailwind CSS configuration.
- [x] Define a comprehensive `.gitignore` file for both frontend and backend (e.g., `node_modules`, `__pycache__`, `venv`, `dist`).

---

### Phase 1: Backend Development (Physics Engine & API)

This phase focuses on building the core physics logic and exposing it through a web API.

- [x] **Collision Engine Module (`collision_engine.py`)**:
    - [x] Create a Python module to encapsulate all physics calculations. Note: The simulation will be 1D (horizontal motion) as per the provided formulas, visualized on a 2D canvas.
    - [x] Implement a function to calculate post-collision velocities based on the general restitution formula.
    - [x] Add functions to calculate momentum (`p = mv`) and kinetic energy (`KE = 0.5 * mv²`).
    - [x] Structure the engine to accept particle masses, initial velocities, and the coefficient of restitution (`e`) as input.
    - [x] The engine should return a structured object containing initial and final states for both particles (velocity, momentum, KE) and a summary of total momentum and KE change.
- [x] **FastAPI Server (`main.py`)**:
    - [x] Set up a basic FastAPI application.
    - [x] Define Pydantic models for the `/simulate` request body and response structure.
    - [x] Create the `/simulate` POST endpoint to receive particle properties, call the collision engine, and return the full results.
    - [x] Create the `/presets` GET endpoint to return a list of pre-defined simulation scenarios (e.g., "Equal Mass – Head-On").
    - [x] Configure CORS (Cross-Origin Resource Sharing) middleware to allow requests from the frontend.

---

### Phase 2: Frontend - Landing Page

This phase involves building the static, visually appealing landing page.

- [x] **Component Structure**:
    - [x] Create a `LandingPage` component that will live at the `/` route.
    - [x] Create a `Footer` component.
- [x] **Styling (Tailwind CSS)**:
    - [x] Implement the black background and futuristic theme.
    - [x] Style the "CRASH COURSE" title and subtitle using the Tektur font.
    - [x] Create the "Try Now" button with its specific black background, red (`#e12726`) outline, and text style.
    - [x] Implement the smooth hover effect for the button, transitioning its background to red.
    - [x] Style the footer with the "2025 © Shafquat Tabeeb" text using the Lexend font and red (`#ff0000`) color.
- [x] **Routing & Transitions**:
    - [x] Set up React Router for navigation between the landing page (`/`) and the simulator (`/simulator`).
    - [x] Plan and implement the cyberpunk-themed glitch transition upon clicking the "Try Now" button.

---

### Phase 3: Frontend - Simulator Core (Canvas & Rendering)

This phase focuses on setting up the interactive canvas where the simulation runs.

- [x] **Simulator Page Structure**:
    - [x] Create a `SimulatorPage` component.
    - [x] Design the responsive two-panel layout (canvas left/top, controls right/bottom) using Tailwind CSS.
- [x] **Canvas Component**:
    - [x] Create a `Canvas` component using the HTML5 `<canvas>` element.
    - [x] Create a custom hook (e.g., `useCanvasAnimation`) to manage the `requestAnimationFrame` loop for 60fps animation.
- [x] **Rendering Logic**:
    - [x] Implement a function to draw the background grid on the canvas.
    - [x] Create a `Particle` class or object factory to manage particle state (position, velocity, mass, radius).
    - [x] Implement a function to draw particles, ensuring their radius is proportional to their mass.
    - [x] Implement drag-and-drop functionality for users to set the initial position of particles on the canvas.
- [x] **Animation Loop**:
    - [x] On "Play", the loop should update particle positions based on velocity.
    - [x] Implement 1D collision detection (when particle positions overlap).
    - [x] After a collision is detected, the animation should use the new velocities calculated by the physics engine.

---

### Phase 4: Frontend - Simulator UI & Controls

This phase involves building the interactive UI elements that allow the user to control the simulation.

- [x] **Control Panel Components**:
    - [x] Create a `ControlsPanel` component.
    - [x] Create reusable `Slider` and `Tab` or `Accordion` components.
    - [x] Create a `ParticleControls` component for each particle, containing sliders for Mass and Initial Velocity.
    - [x] Create a `GlobalControls` component for the Coefficient of Restitution slider and Collision Type selector (Elastic/Inelastic).
- [x] **Simulation Controls**:
    - [x] Create a `SimulationControls` component for the Play, Pause, and Reset buttons.
    - [x] Ensure the Play button smoothly animates into a Pause button and vice-versa.
    - [x] Implement the functionality for all three buttons (start, stop, and reset simulation).
- [x] **Data Read-out Panel**:
    - [x] Create a `DataPanel` component.
    - [x] Display "Before" and "After" collision data (velocities, momentum, KE) for each particle.
    - [x] Include a summary section for total momentum and the change in total kinetic energy.

---

### Phase 5: Frontend - State Management & API Integration ✅

This phase connects the UI, canvas, and backend into a cohesive application.

- [x] **State Management (React Hooks)**:
    - [x] Use `useState` and `useReducer` to manage the state of the entire simulation (particle properties, simulation status like 'idle', 'playing', 'paused').
    - [x] Ensure that adjusting a UI control (e.g., a mass slider) updates the global state, which in turn updates the particle's appearance on the canvas in real-time.
- [x] **API Integration**:
    - [x] When the user clicks "Play", send the current particle and simulation settings to the `/simulate` backend endpoint.
    - [x] Receive the calculated "before" and "after" data from the API.
    - [x] Store this data in the frontend state.
    - [x] Use the returned post-collision velocities to update the animation after the impact.
    - [x] Fetch and display presets from the `/presets` endpoint.
- [x] **Data Flow**:
    - [x] On "Play" -> `API Call` -> `Update State with API response` -> `Start Animation`.
    - [x] `Animation Loop` -> `Detect Collision` -> `Switch to post-collision velocities from state`.
    - [x] `Update DataPanel` with the full results from the state.

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