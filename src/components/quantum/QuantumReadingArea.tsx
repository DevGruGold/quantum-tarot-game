import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import AudioControls from './AudioControls';
import DrawingInstructions from './DrawingInstructions';
import QuantumTimeline from './QuantumTimeline';
import ReadingResults from './ReadingResults';
import { useQuantum } from '@/contexts/QuantumContext';

const positions = [
  { 
    id: 'past', 
    color: 'pink-500',
    baseFreq: 432,
    binauralFreq: 7.83,
    icon: '◐'
  },
  { 
    id: 'present', 
    color: 'purple-500',
    baseFreq: 528,
    binauralFreq: 40,
    icon: '◉'
  },
  { 
    id: 'future', 
    color: 'teal-500',
    baseFreq: 963,
    binauralFreq: 12,
    icon: '◑'
  }
];

const QuantumReadingArea = () => {
  const {
    isRunning,
    time,
    selectedPosition,
    volume,
    audioInitialized,
    resonanceLevel,
    cardData,
    thumbsPlaced,
    birthDate,
    secondBirthDate,
    zodiacSign,
    secondZodiacSign,
    language,
    handlePositionSelect,
    initializeAudio,
    setVolume,
  } = useQuantum();

  return (
    <Card className={cn(
      "bg-black/40 backdrop-blur-lg",
      "border border-purple-500/20",
      "shadow-2xl shadow-purple-500/10",
      "text-gray-50"
    )}>
      <CardHeader className="border-b border-purple-500/20">
        <AudioControls
          initializeAudio={initializeAudio}
          audioInitialized={audioInitialized}
          volume={volume}
          setVolume={setVolume}
        />
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-8">
          {selectedPosition && (
            <DrawingInstructions
              isRunning={isRunning}
              resonanceLevel={resonanceLevel}
              thumbsPlaced={thumbsPlaced}
              language={language}
            />
          )}
          
          <QuantumTimeline
            positions={positions}
            selectedPosition={selectedPosition}
            time={time}
            cardData={cardData}
            resonanceLevel={resonanceLevel}
            onSelectPosition={handlePositionSelect}
            language={language}
          />

          <ReadingResults
            positions={positions}
            selectedPosition={selectedPosition}
            cardData={cardData}
            birthDate={birthDate}
            secondBirthDate={secondBirthDate}
            zodiacSign={zodiacSign}
            secondZodiacSign={secondZodiacSign}
            language={language}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumReadingArea;