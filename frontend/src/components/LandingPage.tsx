/**
 * Landing Page component for the Crash Course application.
 * 
 * Features a minimalistic design with title, subtitle, and call-to-action button.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import GlitchTransition from './GlitchTransition';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTryNowClick = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    navigate('/simulator');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      {/* Main content */}
      <div className="flex flex-col items-center space-y-6">
        {/* Main title */}
        <h1 className="font-tektur text-white text-6xl md:text-8xl font-bold text-center">
          CRASH COURSE
        </h1>
        
        {/* Subtitle */}
        <p className="font-tektur text-white text-lg md:text-xl text-center opacity-80">
          An interactive 2D collision simulator
        </p>
        
        {/* Try Now button */}
        <button
          onClick={handleTryNowClick}
          className="
            font-tektur 
            text-white 
            text-lg 
            px-8 
            py-3 
            bg-black 
            border 
            border-crash-red 
            rounded-lg 
            transition-all 
            duration-300 
            ease-in-out
            hover:bg-crash-red 
            hover:shadow-lg 
            hover:shadow-crash-red/20
            focus:outline-none 
            focus:ring-2 
            focus:ring-crash-red 
            focus:ring-opacity-50
            active:transform 
            active:scale-95
          "
          aria-label="Start the collision simulator"
        >
          Try Now
        </button>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Glitch Transition */}
      <GlitchTransition 
        isActive={isTransitioning} 
        onComplete={handleTransitionComplete} 
      />
    </div>
  );
};

export default LandingPage; 