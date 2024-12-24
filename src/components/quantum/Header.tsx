import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { translations } from '@/data/translations';

const Header = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center mb-4 space-y-2">
      <div className="space-y-1">
        <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 mb-2 quantum-pulse`}>
          {translations.en.title}
        </h1>
        <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-pink-500 to-purple-400 mb-2`}>
          {translations.es.title}
        </h2>
      </div>

      <div className="space-y-1">
        <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-purple-200 opacity-80`}>
          {translations.en.subtitle}
        </p>
        <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-purple-200 opacity-80`}>
          {translations.es.subtitle}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-purple-300/70 max-w-md mx-auto">
          {translations.en.instruction}
        </p>
        <p className="text-xs text-purple-300/70 max-w-md mx-auto">
          {translations.es.instruction}
        </p>
      </div>
    </div>
  );
};

export default Header;