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
  // Calculate frequency-based vibration that stays in formation
  const baseVibration = selectedPosition?.id === position.id 
    ? Math.sin(time * (position.baseFreq/200)) * 3 // Reduced amplitude, adjusted frequency
    : 0;
  
  // Calculate position-specific offsets
  const xOffset = position.id === 'past' ? -baseVibration : 
                position.id === 'future' ? baseVibration : 
                Math.sin(time * 2) * baseVibration;
  
  const yOffset = position.id === 'present' ? 
                Math.cos(time * (position.baseFreq/300)) * 2 : 0;

  return (
    <g 
      transform={`translate(${position.x + xOffset}, ${position.y + yOffset})`}
      onClick={() => handlePositionSelect(position)}
      className="cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      {/* Background glow */}
      <circle
        r="45"
        fill="url(#cardGlow)"
        opacity={selectedPosition?.id === position.id ? "1" : "0.3"}
      />
      
      {/* Card rectangle */}
      <rect
        x="-40"
        y="-60"
        width="80"
        height="120"
        rx="8"
        fill={position.color}
        opacity={cardData[position.id] ? "0.9" : selectedPosition?.id === position.id ? "0.4" : "0.1"}
        stroke={position.color}
        strokeWidth="2"
        className="shadow-lg"
      />
      
      {selectedPosition?.id === position.id && !cardData[position.id] && (
        <>
          <circle
            r={25 + Math.sin(time * 5) * 8}
            fill="none"
            stroke={position.color}
            strokeWidth="2"
            opacity="0.4"
          >
            <animate
              attributeName="r"
              values="25;35;25"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Progress bar */}
          <g transform="translate(0, 45)">
            <rect
              x="-25"
              y="0"
              width="50"
              height="4"
              rx="2"
              fill="none"
              stroke={position.color}
              strokeWidth="1"
              opacity="0.3"
            />
            <rect
              x="-25"
              y="0"
              width={50 * resonanceLevel}
              height="4"
              rx="2"
              fill={position.color}
              opacity="0.8"
            >
              <animate
                attributeName="opacity"
                values="0.6;1;0.6"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </>
      )}

      {cardData[position.id] ? (
        <>
          <text
            y="-30"
            textAnchor="middle"
            fill="white"
            fontSize="14"
            className="font-bold"
          >
            {cardData[position.id].name}
          </text>
          <text
            y="0"
            textAnchor="middle"
            fill="white"
            fontSize="24"
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
          fontSize="24"
          opacity={selectedPosition?.id === position.id ? "0.9" : "0.5"}
        >
          {position.icon}
        </text>
      )}
    </g>
  );
};

export default CardPosition;