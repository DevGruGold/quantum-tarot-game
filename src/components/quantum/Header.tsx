import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center mb-4">
      <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 mb-2 quantum-pulse`}>
        Quantum Tarot™
      </h1>
      <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-purple-200 opacity-80`}>
        Harmonically Aligned Timeline Reading
      </p>
    </div>
  );
};

export default Header;