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
  language: string;  // Added language prop
}

const ReadingResults = ({ 
  positions, 
  selectedPosition, 
  cardData, 
  birthDate, 
  zodiacSign,
  language 
}: ReadingResultsProps) => {
  const isMobile = useIsMobile();

  const getTranslatedPosition = (pos: any, lang: 'en' | 'es') => {
    return translations[lang].positions[pos.id as keyof typeof translations.en.positions];
  };

  const getActionableAdvice = (cards: any[]) => {
    if (!cards || cards.length < 3) return "";
    
    const [past, present, future] = cards;
    
    const getPastAdvice = (card: any) => {
      const orientation = card.isReversed ? "reversed" : "upright";
      const meaning = card.isReversed ? card.reversedMeaning : card.meaning;
      
      return `
        Your past card (${card.name} - ${orientation}) reveals: ${meaning}
        
        Practice for Past Energy:
        - Spend 15 minutes each morning in contemplative release work
        - Focus on the ${card.quantum} frequency for transformation
        - Journal about past patterns that ${card.isReversed ? "need healing" : "support your growth"}
        - Set intentions aligned with ${meaning}
      `;
    };

    const getPresentAdvice = (card: any) => {
      const orientation = card.isReversed ? "reversed" : "upright";
      const meaning = card.isReversed ? card.reversedMeaning : card.meaning;
      
      return `
        Your present moment (${card.name} - ${orientation}) indicates: ${meaning}
        
        Daily Practice:
        - Create sacred space for ${card.isReversed ? "healing and rebalancing" : "growth and alignment"}
        - Work with the ${card.quantum} frequency
        - Practice mindfulness with focus on ${meaning}
        - Document synchronicities related to your current situation
      `;
    };

    const getFutureAdvice = (card: any) => {
      const orientation = card.isReversed ? "reversed" : "upright";
      const meaning = card.isReversed ? card.reversedMeaning : card.meaning;
      
      return `
        Your future potential (${card.name} - ${orientation}) suggests: ${meaning}
        
        Manifestation Practice:
        - Visualize outcomes aligned with ${meaning}
        - Work with ${card.quantum} energy for manifestation
        - Create affirmations that address ${card.isReversed ? "potential challenges" : "emerging opportunities"}
        - Set concrete steps toward your desired future
      `;
    };

    return `
      Quantum Alignment Practices:
      
      1. Past Integration:
      ${getPastAdvice(past)}
      
      2. Present Awareness:
      ${getPresentAdvice(present)}
      
      3. Future Potential:
      ${getFutureAdvice(future)}
      
      Remember: These practices work with quantum field coherence. The orientation of each card (upright or reversed) provides additional insight into the energies at play. Work with both challenging and supportive aspects to create holistic transformation.
    `;
  };

  const getCombinedReading = () => {
    const cards = positions.map(pos => cardData[pos.id]).filter(Boolean);
    if (cards.length === 3) {
      return (
        <div className="space-y-4">
          {birthDate && (
            <Card className="p-6 bg-black/40 border-purple-500/20">
              <h3 className="text-lg font-semibold text-purple-300 mb-4">Astrological Insight</h3>
              <p className="text-purple-100">
                {getAstrologicalReading(zodiacSign, cardData)}
              </p>
            </Card>
          )}

          <Card className="p-6 bg-black/40 border-purple-500/20">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Quantum Guidance & Practice</h3>
            <div className="text-purple-100 whitespace-pre-line">
              {getActionableAdvice(cards)}
            </div>
          </Card>
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
                  {getTranslatedPosition(pos, language as 'en' | 'es').title}
                </h3>
                
                {cardData[pos.id] ? (
                  <div className="space-y-1.5">
                    <div className="text-base font-bold text-white">
                      {cardData[pos.id].name} {cardData[pos.id].isReversed ? "(Reversed)" : ""}
                    </div>
                    <div className="text-xs text-purple-300">
                      {cardData[pos.id].quantum}
                    </div>
                    <div className="text-xs text-teal-300">
                      {cardData[pos.id].astro}
                    </div>
                    <div className="mt-4 text-sm text-purple-200">
                      {cardData[pos.id].isReversed ? 
                        cardData[pos.id].reversedMeaning :
                        cardData[pos.id].meaning
                      }
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-purple-200/60 text-xs">
                      {getTranslatedPosition(pos, language as 'en' | 'es').description}
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