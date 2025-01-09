import React from 'react';
import { cn } from "@/lib/utils";
import Header from './quantum/Header';
import BirthDateForm from './quantum/BirthDateForm';
import QuantumReadingArea from './quantum/QuantumReadingArea';
import ThumbprintArea from './quantum/ThumbprintArea';
import { QuantumProvider, useQuantum } from '@/contexts/QuantumContext';

const QuantumTarotContent = () => {
  const {
    thumbsPlaced,
    handleThumbPlacement,
    handleBirthDateSubmit,
    birthDate,
    secondBirthDate,
    language,
    setLanguage
  } = useQuantum();

  return (
    <div className={cn(
      "min-h-screen py-8 px-4",
      "bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900",
      "text-gray-50"
    )}>
      <div className="container mx-auto max-w-6xl">
        <Header language={language} />
        
        <BirthDateForm
          onBirthDateSubmit={handleBirthDateSubmit}
          birthDate={birthDate}
          secondBirthDate={secondBirthDate}
          language={language}
          onLanguageChange={setLanguage}
        />

        <QuantumReadingArea />
        
        <div className="relative h-24">
          <ThumbprintArea
            side="left"
            isPlaced={thumbsPlaced.left}
            onToggle={() => handleThumbPlacement('left')}
          />
          <ThumbprintArea
            side="right"
            isPlaced={thumbsPlaced.right}
            onToggle={() => handleThumbPlacement('right')}
          />
        </div>
      </div>
    </div>
  );
};

const QuantumTarot = () => (
  <QuantumProvider>
    <QuantumTarotContent />
  </QuantumProvider>
);

export default QuantumTarot;