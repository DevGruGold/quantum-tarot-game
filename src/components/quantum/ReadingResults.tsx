import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReadingResultsProps {
  positions: any[];
  selectedPosition: any;
  cardData: Record<string, any>;
}

const ReadingResults = ({ positions, selectedPosition, cardData }: ReadingResultsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
      {positions.map(pos => (
        <div key={pos.id} className="card-container">
          <div 
            className={`card h-full border rounded-xl p-4 backdrop-blur-sm transition-all ${
              selectedPosition?.id === pos.id 
                ? 'bg-purple-900/40 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                : 'bg-black/20 border-purple-500/10 hover:border-purple-500/30'
            }`}
          >
            <h3 className="text-xl font-semibold mb-3" style={{ color: pos.color }}>
              {pos.id.toUpperCase()}
            </h3>
            
            {cardData[pos.id] ? (
              <div className="space-y-2">
                <div className="text-lg font-bold text-white">
                  {cardData[pos.id].name}
                </div>
                <div className="text-sm text-purple-300">
                  {cardData[pos.id].quantum}
                </div>
                <div className="text-sm text-teal-300">
                  {cardData[pos.id].astro}
                </div>
              </div>
            ) : (
              <p className="text-purple-200/60 text-sm">
                {selectedPosition?.id === pos.id 
                  ? `Aligning to ${pos.baseFreq}Hz...`
                  : pos.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadingResults;