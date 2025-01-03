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

  const getActionableAdvice = (cards: any[]) => {
    if (!cards || cards.length < 3) return "";
    
    const [past, present, future] = cards;
    
    const getPastAdvice = (card: any) => {
      const baseAdvice = card.name === "The Tower" ? 
        "embrace the dissolution of old structures" : 
        "acknowledge and release past patterns";
      
      return `
        Your past card (${card.name}) reveals deep quantum entanglement with previous experiences.
        Key Practice: Spend 15 minutes each morning in contemplative release work.
        - Write down what you're ready to let go
        - Visualize these patterns dissolving into quantum potential
        - Focus on the feeling of lightness as you release
        
        Remember: ${card.quantum} energy supports this transformation.
      `;
    };

    const getPresentAdvice = (card: any) => {
      const focusType = card.name === "The Hermit" ? 
        "inner wisdom and solitude" : 
        "active participation in your current reality";
      
      return `
        Your present moment (${card.name}) calls for deep alignment with ${focusType}.
        Daily Practice: Create a 20-minute sacred space for presence.
        - Set intentions aligned with ${card.quantum}
        - Observe your thoughts without attachment
        - Connect with your body's natural frequencies
        - Journal about synchronicities you notice
      `;
    };

    const getFutureAdvice = (card: any) => {
      const potentialType = card.name === "The World" ? 
        "completion and new cycles" : 
        "emerging quantum possibilities";
      
      return `
        Your future card (${card.name}) points toward ${potentialType}.
        Manifestation Practice:
        - Create a detailed vision board representing your desired outcomes
        - Spend time daily energetically connecting with these possibilities
        - Notice and document signs that align with your vision
        - Stay open to unexpected quantum alignments
        
        Work with the ${card.quantum} frequency to amplify your intentions.
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
      
      Remember: These practices work with quantum field coherence. Consistency and intention are key to shifting your energy patterns.
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