import React from 'react';
import { Progress } from "@/components/ui/progress";

interface CardPositionProps {
  position: any;
  selectedPosition: any;
  time: number;
  cardData: Record<string, any>;
  resonanceLevel: number;
  handlePositionSelect: (position: any) => void;
  isMobile: boolean;
}

const CardPosition = ({ 
  position, 
  selectedPosition, 
  time, 
  cardData, 
  resonanceLevel,
  handlePositionSelect,
  isMobile
}: CardPositionProps) => {
  const getVibrationPattern = () => {
    // Only apply vibration when selected
    if (selectedPosition?.id !== position.id) return { x: 0, y: 0 };
    
    const baseAmplitude = 1.5; // Reduced amplitude for more stable formation
    const timeScale = position.baseFreq / 100;
    
    switch (position.id) {
      case 'past':
        return {
          x: -Math.sin(time * timeScale) * baseAmplitude * 0.5,
          y: Math.cos(time * timeScale) * baseAmplitude * 0.3
        };
      case 'present':
        return {
          x: Math.cos(time * timeScale) * baseAmplitude * 0.3,
          y: Math.sin(time * timeScale) * baseAmplitude * 0.5
        };
      case 'future':
        return {
          x: Math.sin(time * timeScale) * baseAmplitude * 0.5,
          y: Math.cos(time * timeScale) * baseAmplitude * 0.3
        };
      default:
        return { x: 0, y: 0 };
    }
  };

  const vibration = getVibrationPattern();

  // Frequency visualization patterns
  const getFrequencyPattern = () => {
    if (selectedPosition?.id !== position.id) return [];
    
    const points = [];
    const segments = 12;
    const radius = 45;
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const frequency = position.baseFreq / 100;
      const amplitude = Math.sin(time * frequency + i) * 5;
      const x = Math.cos(angle) * (radius + amplitude);
      const y = Math.sin(angle) * (radius + amplitude);
      points.push(`${x},${y}`);
    }
    
    return points;
  };

  const frequencyPoints = getFrequencyPattern();

  return (
    <g 
      transform={`translate(${position.x + vibration.x}, ${position.y + vibration.y})`}
      onClick={() => handlePositionSelect(position)}
      className="cursor-pointer transition-transform duration-300"
    >
      {/* Quantum resonance field */}
      <circle
        r={40 + Math.sin(time * 5) * 2}
        fill="url(#cardGlow)"
        opacity={selectedPosition?.id === position.id ? 
          0.3 + Math.sin(time * 2) * 0.1 : 
          0.1 + Math.sin(time * 1.5) * 0.05}
      />
      
      {/* Frequency visualization ring */}
      {selectedPosition?.id === position.id && (
        <polygon
          points={frequencyPoints.join(' ')}
          fill="none"
          stroke={position.color}
          strokeWidth="0.5"
          opacity={0.3 + Math.sin(time * 2) * 0.2}
          className="animate-pulse"
        />
      )}
      
      {/* Card base */}
      <rect
        x="-30"
        y="-45"
        width="60"
        height="90"
        rx="4"
        fill={position.color}
        opacity={cardData[position.id] ? "0.9" : 
          selectedPosition?.id === position.id ? 
          0.4 + Math.sin(time * 3) * 0.1 : "0.2"}
        stroke={position.color}
        strokeWidth="1.5"
        className="shadow-lg"
      />
      
      {/* Progress bar */}
      {selectedPosition?.id === position.id && !cardData[position.id] && (
        <foreignObject x="-25" y="25" width="50" height="10">
          <Progress 
            value={resonanceLevel * 100} 
            className="h-1 w-full bg-white/20"
          />
        </foreignObject>
      )}
      
      {/* Card content */}
      {cardData[position.id] ? (
        <>
          <text
            y="-25"
            textAnchor="middle"
            fill="white"
            fontSize="12"
            className="font-bold"
          >
            {cardData[position.id].name}
          </text>
          <text
            y="0"
            textAnchor="middle"
            fill="white"
            fontSize="18"
            opacity="0.9"
          >
            {position.icon}
          </text>
        </>
      ) : (
        <text
          y="0"
          textAnchor="middle"
          fill="white"
          fontSize="18"
          opacity={selectedPosition?.id === position.id ? 
            0.8 + Math.sin(time * 2) * 0.2 : "0.5"}
        >
          {position.icon}
        </text>
      )}
    </g>
  );
};

export default CardPosition;