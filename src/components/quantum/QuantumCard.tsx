import React from 'react';
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface QuantumCardProps {
  position: any;
  isSelected: boolean;
  time: number;
  cardData: any;
  resonanceLevel: number;
  onClick: () => void;
}

const QuantumCard = ({
  position,
  isSelected,
  time,
  cardData,
  resonanceLevel,
  onClick
}: QuantumCardProps) => {
  const baseAnimation = "transition-all duration-500 ease-out";
  const hoverEffect = "hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105";
  
  const getQuantumPulse = () => {
    if (!isSelected) return {};
    const amplitude = 3;
    const frequency = position.baseFreq / 100;
    return {
      transform: `translate(
        ${Math.sin(time * frequency) * amplitude}px,
        ${Math.cos(time * frequency) * amplitude}px
      )`
    };
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded-lg p-6",
        baseAnimation,
        !isSelected && hoverEffect
      )}
      style={getQuantumPulse()}
    >
      <div className={cn(
        "absolute inset-0 rounded-lg transition-opacity duration-500",
        isSelected ? "opacity-20" : "opacity-0",
        `bg-gradient-to-r from-${position.color}/50 to-purple-500/50`
      )} />
      
      <div className={cn(
        "relative z-10 flex flex-col items-center justify-center",
        "min-h-[200px] space-y-4"
      )}>
        {cardData ? (
          <>
            <h3 className="text-xl font-bold text-white">{cardData.name}</h3>
            <span className="text-4xl">{position.icon}</span>
            <div className="text-sm text-purple-200">{cardData.quantum}</div>
          </>
        ) : (
          <>
            <span className={cn(
              "text-5xl transition-all duration-300",
              isSelected && "animate-pulse"
            )}>
              {position.icon}
            </span>
            {isSelected && (
              <Progress 
                value={resonanceLevel * 100} 
                className="w-32 h-1 bg-purple-900/20"
              />
            )}
          </>
        )}
      </div>

      {/* Quantum field effect */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 animate-pulse rounded-lg border border-purple-500/30" />
          <div className="absolute inset-2 animate-pulse rounded-lg border border-purple-400/20" 
               style={{ animationDelay: "150ms" }} />
          <div className="absolute inset-4 animate-pulse rounded-lg border border-purple-300/10"
               style={{ animationDelay: "300ms" }} />
        </div>
      )}
    </div>
  );
};

export default QuantumCard;