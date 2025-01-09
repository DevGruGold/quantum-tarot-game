import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { translations } from '@/data/translations';

interface HeaderProps {
  language: string;
}

const Header = ({ language }: HeaderProps) => {
  const isMobile = useIsMobile();
  const trans = translations[language as keyof typeof translations];
  
  return (
    <div className="text-center mb-4 space-y-2">
      <div className="space-y-1">
        <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl md:text-6xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 mb-2 quantum-pulse`}>
          {trans.title}
        </h1>
      </div>

      <div className="space-y-1">
        <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-purple-200 opacity-80`}>
          {trans.subtitle}
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-purple-300/70 max-w-md mx-auto">
          {trans.instruction}
        </p>
      </div>
    </div>
  );
};

export default Header;