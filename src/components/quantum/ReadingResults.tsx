import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { translations } from '@/data/translations';

interface ReadingResultsProps {
  positions: any[];
  selectedPosition: any;
  cardData: Record<string, any>;
}

const ReadingResults = ({ positions, selectedPosition, cardData }: ReadingResultsProps) => {
  const isMobile = useIsMobile();

  const getTranslatedPosition = (pos: any, lang: 'en' | 'es') => {
    return translations[lang].positions[pos.id as keyof typeof translations.en.positions];
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3 mt-4 max-w-[350px] mx-auto' : 'grid-cols-3 gap-6'}`}>
      {positions.map(pos => (
        <div key={pos.id} className="card-container">
          <div 
            className={`card h-full border rounded-xl p-3 backdrop-blur-sm transition-all ${
              selectedPosition?.id === pos.id 
                ? 'bg-purple-900/40 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                : 'bg-black/20 border-purple-500/10 hover:border-purple-500/30'
            }`}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold" style={{ color: pos.color }}>
                {getTranslatedPosition(pos, 'en').title} / {getTranslatedPosition(pos, 'es').title}
              </h3>
              
              {cardData[pos.id] ? (
                <div className="space-y-1.5">
                  <div className="text-base font-bold text-white">
                    {cardData[pos.id].name}
                  </div>
                  <div className="text-xs text-purple-300">
                    {cardData[pos.id].quantum}
                  </div>
                  <div className="text-xs text-teal-300">
                    {cardData[pos.id].astro}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-purple-200/60 text-xs">
                    {getTranslatedPosition(pos, 'en').description}
                  </p>
                  <p className="text-purple-200/60 text-xs">
                    {getTranslatedPosition(pos, 'es').description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadingResults;