/**
 * Landing Page component for the Crash Course application.
 * 
 * Features a minimalistic design with title, subtitle, and call-to-action button.
 * Enhanced with responsive design and smooth animations.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import GlitchTransition from './GlitchTransition';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTryNowClick = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    navigate('/simulator');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-crash-red/20 rotate-45 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-crash-red/10 rotate-12 animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-crash-red/15 -rotate-12 animate-pulse animation-delay-2000" />
      </div>

      {/* Main content with entrance animation */}
      <div className={`
        flex flex-col items-center space-y-6 sm:space-y-8 transition-all duration-1000 ease-out
        ${isLoaded 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
        }
      `}>
        {/* Main title with responsive sizing */}
        <h1 className={`
          font-tektur text-white font-bold text-center leading-tight
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
          transition-all duration-1000 ease-out delay-200
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          <span className="inline-block animate-pulse animation-delay-300">C</span>
          <span className="inline-block animate-pulse animation-delay-400">R</span>
          <span className="inline-block animate-pulse animation-delay-500">A</span>
          <span className="inline-block animate-pulse animation-delay-600">S</span>
          <span className="inline-block animate-pulse animation-delay-700">H</span>
          <span className="inline-block mx-2 sm:mx-3"></span>
          <span className="inline-block animate-pulse animation-delay-800">C</span>
          <span className="inline-block animate-pulse animation-delay-900">O</span>
          <span className="inline-block animate-pulse animation-delay-1000">U</span>
          <span className="inline-block animate-pulse animation-delay-1100">R</span>
          <span className="inline-block animate-pulse animation-delay-1200">S</span>
          <span className="inline-block animate-pulse animation-delay-1300">E</span>
        </h1>
        
        {/* Subtitle with enhanced responsive design */}
        <p className={`
          font-tektur text-white text-center opacity-80 max-w-md px-4
          text-sm sm:text-base md:text-lg lg:text-xl
          transition-all duration-1000 ease-out delay-400
          ${isLoaded ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          An interactive 2D collision simulator
          <br className="hidden sm:inline" />
          <span className="block sm:inline"> powered by physics</span>
        </p>
        
        {/* Enhanced Try Now button with better touch targets */}
        <button
          onClick={handleTryNowClick}
          disabled={isTransitioning}
          className={`
            group font-tektur text-white font-medium relative overflow-hidden
            text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4
            bg-black border border-crash-red rounded-lg
            transition-all duration-300 ease-in-out
            hover:bg-crash-red hover:shadow-lg hover:shadow-crash-red/20
            focus:outline-none focus:ring-2 focus:ring-crash-red focus:ring-opacity-50
            active:transform active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            min-w-[120px] sm:min-w-[140px]
            transform transition-all duration-1000 ease-out delay-600
            ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            ${isTransitioning ? 'animate-pulse' : ''}
          `}
          aria-label="Start the collision simulator"
        >
          {/* Button background effect */}
          <span className="absolute inset-0 bg-crash-red transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          
          {/* Button text */}
          <span className="relative z-10 flex items-center justify-center">
            {isTransitioning ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                Try Now
                <svg className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </button>

        {/* Subtle hint for mobile users */}
        <p className={`
          text-xs text-gray-500 text-center mt-4 px-4
          transition-all duration-1000 ease-out delay-800
          ${isLoaded ? 'opacity-60' : 'opacity-0'}
          md:hidden
        `}>
          Best experienced in landscape mode
        </p>
      </div>
      
      {/* Enhanced Footer */}
      <div className={`
        transition-all duration-1000 ease-out delay-1000
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
      `}>
        <Footer />
      </div>
      
      {/* Glitch Transition */}
      <GlitchTransition 
        isActive={isTransitioning} 
        onComplete={handleTransitionComplete} 
      />

      {/* Custom CSS for animation delays */}
      <style>{`
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-800 { animation-delay: 800ms; }
        .animation-delay-900 { animation-delay: 900ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1100 { animation-delay: 1100ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
        .animation-delay-1300 { animation-delay: 1300ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </div>
  );
};

export default LandingPage; 