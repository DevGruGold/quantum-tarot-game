import React from 'react';

interface CardPositionProps {
  position: any;
  selectedPosition: any;
  time: number;
  cardData: Record<string, any>;
  resonanceLevel: number;
  handlePositionSelect: (position: any) => void;
}

const CardPosition = ({ 
  position, 
  selectedPosition, 
  time, 
  cardData, 
  resonanceLevel,
  handlePositionSelect 
}: CardPositionProps) => {
  const getVibrationPattern = () => {
    if (selectedPosition?.id !== position.id) return { x: 0, y: 0 };
    
    const baseAmplitude = 2;
    const timeScale = position.baseFreq / 100;
    
    switch (position.id) {
      case 'past':
        return {
          x: -Math.sin(time * timeScale) * baseAmplitude,
          y: Math.cos(time * timeScale) * (baseAmplitude * 0.5)
        };
      case 'present':
        return {
          x: Math.cos(time * timeScale) * (baseAmplitude * 0.3),
          y: Math.sin(time * timeScale) * baseAmplitude
        };
      case 'future':
        return {
          x: Math.sin(time * timeScale) * baseAmplitude,
          y: Math.cos(time * timeScale) * (baseAmplitude * 0.5)
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
      className="cursor-pointer transition-transform duration-300 hover:scale-105"
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
        <>
          <polygon
            points={frequencyPoints.join(' ')}
            fill="none"
            stroke={position.color}
            strokeWidth="0.5"
            opacity={0.3 + Math.sin(time * 2) * 0.2}
            className="animate-pulse"
          />
          {/* Touch instruction indicator */}
          <circle
            r="8"
            cy="35"
            fill={position.color}
            opacity={0.3 + Math.sin(time * 3) * 0.2}
            className="animate-pulse"
          >
            <title>Place thumb here for reading</title>
          </circle>
        </>
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
      
      {/* Quantum alignment indicators */}
      {selectedPosition?.id === position.id && !cardData[position.id] && (
        <>
          <circle
            r={20 + Math.sin(time * position.baseFreq/100) * 5}
            fill="none"
            stroke={position.color}
            strokeWidth="1.5"
            opacity={0.3 + Math.sin(time * 2) * 0.2}
          >
            <animate
              attributeName="r"
              values="20;25;20"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Resonance progress */}
          <g transform="translate(0, 35)">
            <rect
              x="-20"
              y="0"
              width="40"
              height="3"
              rx="1.5"
              fill="none"
              stroke={position.color}
              strokeWidth="0.5"
              opacity="0.3"
            />
            <rect
              x="-20"
              y="0"
              width={40 * resonanceLevel}
              height="3"
              rx="1.5"
              fill={position.color}
              opacity={0.6 + Math.sin(time * 4) * 0.2}
            />
          </g>
        </>
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