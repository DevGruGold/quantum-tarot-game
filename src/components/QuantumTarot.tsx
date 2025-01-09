import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { initializeAudioContext, createOscillators } from '@/utils/audioUtils';
import { selectRandomCard } from '@/utils/cardUtils';
import { getZodiacSign } from '@/utils/astroUtils';
import Header from './quantum/Header';
import AudioControls from './quantum/AudioControls';
import QuantumTimeline from './quantum/QuantumTimeline';
import ReadingResults from './quantum/ReadingResults';
import ThumbprintArea from './quantum/ThumbprintArea';
import BirthDateForm from './quantum/BirthDateForm';
import DrawingInstructions from './quantum/DrawingInstructions';
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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

const QuantumTarot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [volume, setVolume] = useState(0.3);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [cardData, setCardData] = useState<Record<string, any>>({});
  const [thumbsPlaced, setThumbsPlaced] = useState({ left: false, right: false });
  const [birthDate, setBirthDate] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [language, setLanguage] = useState('en');

  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<any>({ left: null, right: null });
  const gainNodeRef = useRef<any>(null);

  const handleBirthDateSubmit = (date: string) => {
    setBirthDate(date);
    if (date) {
      const sign = getZodiacSign(date);
      setZodiacSign(sign);
    }
  };

  const handlePositionSelect = (position: any) => {
    if (selectedPosition?.id === position.id) {
      setSelectedPosition(null);
      setIsRunning(false);
      stopAudio();
      setResonanceLevel(0);
    } else {
      setSelectedPosition(position);
      setIsRunning(true);
      startAudio(position);
      setResonanceLevel(0);
      startReading();
    }
  };

  const initializeAudio = async () => {
    const context = await initializeAudioContext();
    if (context) {
      audioContextRef.current = context;
      setAudioInitialized(true);
    }
  };

  const startAudio = (position: any) => {
    if (!audioContextRef.current) return;
    
    stopAudio(); // Clean up existing audio

    try {
      const { leftOsc, rightOsc, gainNode } = createOscillators(
        audioContextRef.current,
        position,
        volume
      );

      oscillatorsRef.current = { left: leftOsc, right: rightOsc };
      gainNodeRef.current = gainNode;
      leftOsc.start();
      rightOsc.start();
    } catch (error) {
      console.error("Error starting audio:", error);
    }
  };

  const stopAudio = () => {
    try {
      if (oscillatorsRef.current.left) {
        oscillatorsRef.current.left.stop();
        oscillatorsRef.current.left.disconnect();
      }
      if (oscillatorsRef.current.right) {
        oscillatorsRef.current.right.stop();
        oscillatorsRef.current.right.disconnect();
      }
      oscillatorsRef.current = { left: null, right: null };
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  };

  const handleThumbPlacement = (side: 'left' | 'right') => {
    setThumbsPlaced(prev => ({ ...prev, [side]: !prev[side] }));
  };

  const startReading = () => {
    if (!selectedPosition) return;
    
    setIsRunning(true);
    startAudio(selectedPosition);
    setResonanceLevel(0);
    
    toast({
      title: language === 'en' ? "Reading initiated" : "Lectura iniciada",
      description: language === 'en' ? "The frequencies are aligning..." : "Las frecuencias se están alineando...",
    });
  };

  useEffect(() => {
    let frameId: number;
    if (isRunning) {
      const animate = () => {
        setTime(t => {
          const newTime = (t + 0.01) % (Math.PI * 2);
          return newTime;
        });
        frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
    }
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && selectedPosition && !cardData[selectedPosition.id]) {
      interval = setInterval(() => {
        setResonanceLevel(prev => {
          const newLevel = Math.min(prev + 0.015, 1);
          if (newLevel >= 1) {
            const card = selectRandomCard(time);
            setCardData(prev => ({
              ...prev,
              [selectedPosition.id]: card
            }));
            setTimeout(() => {
              stopAudio();
              setIsRunning(false);
              setThumbsPlaced({ left: false, right: false });
            }, 1000);
          }
          return newLevel;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedPosition, time]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={cn(
      "min-h-screen py-8 px-4",
      "bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900",
      "text-gray-50"
    )}>
      <div className="container mx-auto max-w-6xl">
        <Header language={language} />
        
        <BirthDateForm
          onBirthDateSubmit={handleBirthDateSubmit}
          birthDate={birthDate}
          language={language}
          onLanguageChange={setLanguage}
        />

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
                zodiacSign={zodiacSign}
                language={language}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="relative h-24">
          <ThumbprintArea
            side="left"
            isPlaced={thumbsPlaced.left}
            onToggle={() => handleThumbPlacement('left')}
          />
          <ThumbprintArea
            side="right"
            isPlaced={thumbsPlaced.right}
            onToggle={() => handleThumbPlacement('right')}
          />
        </div>
      </div>
    </div>
  );
};

export default QuantumTarot;
