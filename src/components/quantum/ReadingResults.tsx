import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { translations } from '@/data/translations';
import { Card } from '@/components/ui/card';
import { getAstrologicalReading } from '@/utils/astroUtils';

interface ReadingResultsProps {
  positions: any[];
  selectedPosition: any;
  cardData: Record<string, any>;
  birthDate: string;
  zodiacSign: string;
}

const ReadingResults = ({ positions, selectedPosition, cardData, birthDate, zodiacSign }: ReadingResultsProps) => {
  const isMobile = useIsMobile();

  const getTranslatedPosition = (pos: any, lang: 'en' | 'es') => {
    return translations[lang].positions[pos.id as keyof typeof translations.en.positions];
  };

  const getCombinedReading = () => {
    const cards = positions.map(pos => cardData[pos.id]).filter(Boolean);
    if (cards.length === 3) {
      return (
        <div className="space-y-4">
          <Card className="p-6 bg-black/40 border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Combined Energy Reading</h3>
            <p className="text-purple-100">
              The {cards[0].name} in your past flows into the {cards[1].name} of your present moment, 
              leading towards the {cards[2].name} in your future. This progression suggests a journey 
              through quantum states of consciousness, where past experiences have shaped your current 
              reality, and your present awareness is creating ripples into future possibilities.
            </p>
          </Card>
          
          {birthDate && (
            <Card className="p-6 bg-black/40 border-purple-500/20">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Astrological Insight</h3>
              <p className="text-purple-100">
                {getAstrologicalReading(zodiacSign, cardData)}
              </p>
            </Card>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
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
                <h3 className="text-lg font-semibold" style={{ color: `rgb(var(--${pos.color}))` }}>
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
                    <div className="mt-4 text-sm text-purple-200">
                      {pos.id === 'past' && (
                        "This energy from your past continues to influence your quantum state, creating interference patterns in your present reality."
                      )}
                      {pos.id === 'present' && (
                        "Your current quantum state represents a moment of conscious observation, collapsing possibilities into your present experience."
                      )}
                      {pos.id === 'future' && (
                        "This potential future timeline represents one of many quantum possibilities, influenced by your present choices and observations."
                      )}
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
      {getCombinedReading()}
    </div>
  );
};

export default ReadingResults;