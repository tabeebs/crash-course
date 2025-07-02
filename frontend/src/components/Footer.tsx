/**
 * Footer component for the Crash Course application.
 * 
 * Displays the copyright information at the bottom of the page.
 */

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-center items-center py-4">
      <p className="font-lexend text-crash-red-bright text-sm">
        2025 © Shafquat Tabeeb
      </p>
    </footer>
  );
};

export default Footer; 