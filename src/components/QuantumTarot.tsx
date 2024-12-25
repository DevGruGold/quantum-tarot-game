import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { tarotDeck } from '@/data/tarotDeck';
import { initializeAudioContext, createOscillators } from '@/utils/audioUtils';
import { selectRandomCard } from '@/utils/cardUtils';
import Header from './quantum/Header';
import AudioControls from './quantum/AudioControls';
import TimelineDisplay from './quantum/TimelineDisplay';
import ReadingResults from './quantum/ReadingResults';
import { useToast } from "@/components/ui/use-toast";
import 'bootstrap/dist/css/bootstrap.min.css';

const QuantumTarot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [volume, setVolume] = useState(0.3);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [cardData, setCardData] = useState<Record<string, any>>({});
  const [thumbsPlaced, setThumbsPlaced] = useState({ left: false, right: false });

  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<any>({ left: null, right: null });
  const gainNodeRef = useRef<any>(null);

  const positions = [
    { 
      id: 'past', 
      color: '#EC4899',
      baseFreq: 432,
      binauralFreq: 7.83,
      x: 100, 
      y: 200,
      icon: '◐'
    },
    { 
      id: 'present', 
      color: '#8B5CF6',
      baseFreq: 528,
      binauralFreq: 40,
      x: 200, 
      y: 150,
      icon: '◉'
    },
    { 
      id: 'future', 
      color: '#14B8A6',
      baseFreq: 963,
      binauralFreq: 12,
      x: 300, 
      y: 200,
      icon: '◑'
    }
  ];

  // Initialize Audio Context
  const initializeAudio = async () => {
    const context = await initializeAudioContext();
    if (context) {
      audioContextRef.current = context;
      setAudioInitialized(true);
    }
  };

  // Start Audio
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
      startReading(); // Start reading immediately upon selection
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
      title: "Reading initiated",
      description: "The frequencies are aligning...",
    });
  };

  useEffect(() => {
    let frameId: number;
    if (isRunning) {
      const animate = () => {
        setTime(t => {
          // Slower time progression for more visible vibrations
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

  // Modified resonance effect and card reveal - removed thumb placement requirement
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-light py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Header />

        <Card className="bg-black/40 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
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
              <TimelineDisplay
                positions={positions}
                selectedPosition={selectedPosition}
                time={time}
                cardData={cardData}
                resonanceLevel={resonanceLevel}
                handlePositionSelect={handlePositionSelect}
              />

              <ReadingResults
                positions={positions}
                selectedPosition={selectedPosition}
                cardData={cardData}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Thumbprint areas - kept for visual reference but no longer mandatory */}
        <div className="thumbprint-areas">
          <div 
            onClick={() => handleThumbPlacement('left')}
            className="cursor-pointer"
            style={{ position: 'absolute', left: '60px', bottom: '20px' }}
          >
            <div className="thumbprint" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(88, 28, 135, 0.8)', opacity: thumbsPlaced.left ? 1 : 0.5 }}>
              <span className="tooltip">Optional: Place left thumb here</span>
            </div>
          </div>
          
          <div 
            onClick={() => handleThumbPlacement('right')}
            className="cursor-pointer"
            style={{ position: 'absolute', right: '60px', bottom: '20px' }}
          >
            <div className="thumbprint" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(88, 28, 135, 0.8)', opacity: thumbsPlaced.right ? 1 : 0.5 }}>
              <span className="tooltip">Optional: Place right thumb here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumTarot;
