import React from 'react';
import QuantumCard from './QuantumCard';
import { cn } from "@/lib/utils";

interface QuantumTimelineProps {
  positions: any[];
  selectedPosition: any;
  time: number;
  cardData: Record<string, any>;
  resonanceLevel: number;
  onSelectPosition: (position: any) => void;
}

const QuantumTimeline = ({
  positions,
  selectedPosition,
  time,
  cardData,
  resonanceLevel,
  onSelectPosition
}: QuantumTimelineProps) => {
  return (
    <div className={cn(
      "grid gap-6 p-6",
      "md:grid-cols-3 grid-cols-1",
      "bg-black/60 rounded-xl",
      "border border-purple-500/20",
      "shadow-inner"
    )}>
      {positions.map((position) => (
        <QuantumCard
          key={position.id}
          position={position}
          isSelected={selectedPosition?.id === position.id}
          time={time}
          cardData={cardData[position.id]}
          resonanceLevel={resonanceLevel}
          onClick={() => onSelectPosition(position)}
        />
      ))}
    </div>
  );
};

export default QuantumTimeline;