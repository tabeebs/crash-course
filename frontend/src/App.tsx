/**
 * Main App component with routing setup.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SimulatorPage from './components/SimulatorPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/simulator" element={
              <ErrorBoundary fallback={
                <div className="min-h-screen bg-black flex items-center justify-center text-white">
                  <div className="text-center">
                    <h2 className="text-xl font-tektur mb-4 text-crash-red">Simulator Error</h2>
                    <p className="mb-4">The simulation engine encountered an error.</p>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="px-4 py-2 bg-crash-red text-white rounded hover:bg-red-600"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              }>
                <SimulatorPage />
              </ErrorBoundary>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
