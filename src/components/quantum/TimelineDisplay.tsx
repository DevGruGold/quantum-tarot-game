import React from 'react';
import CardPosition from './CardPosition';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimelineDisplayProps {
  positions: any[];
  selectedPosition: any;
  time: number;
  cardData: Record<string, any>;
  resonanceLevel: number;
  handlePositionSelect: (position: any) => void;
}

const TimelineDisplay = ({
  positions,
  selectedPosition,
  time,
  cardData,
  resonanceLevel,
  handlePositionSelect
}: TimelineDisplayProps) => {
  const isMobile = useIsMobile();

  // Adjust positions for mobile portrait mode
  const getAdjustedPositions = (positions: any[]) => {
    if (!isMobile) return positions;

    return positions.map((pos, index) => ({
      ...pos,
      x: 175, // Centered horizontally
      y: 120 + (index * 180), // Reduced vertical spacing
    }));
  };

  const adjustedPositions = getAdjustedPositions(positions);

  return (
    <div className={`relative ${isMobile ? 'h-[600px]' : 'aspect-[16/9]'} bg-black/60 rounded-xl overflow-hidden border border-purple-500/20 shadow-inner mx-auto ${isMobile ? 'max-w-[350px]' : ''}`}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="cardGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </radialGradient>
        </defs>
        
        {adjustedPositions.map((position) => (
          <CardPosition
            key={position.id}
            position={position}
            selectedPosition={selectedPosition}
            time={time}
            cardData={cardData}
            resonanceLevel={resonanceLevel}
            handlePositionSelect={handlePositionSelect}
          />
        ))}
      </svg>
    </div>
  );
};

export default TimelineDisplay;