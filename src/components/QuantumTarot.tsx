import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { tarotDeck } from '@/data/tarotDeck';
import { initializeAudioContext, createOscillators } from '@/utils/audioUtils';
import { selectRandomCard } from '@/utils/cardUtils';
import Header from './quantum/Header';
import AudioControls from './quantum/AudioControls';
import TimelineDisplay from './quantum/TimelineDisplay';
import ReadingResults from './quantum/ReadingResults';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuantumTarot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [volume, setVolume] = useState(0.3);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [cardData, setCardData] = useState<Record<string, any>>({});

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
      description: 'Past Timeline Resonance',
      icon: '◐'
    },
    { 
      id: 'present', 
      color: '#8B5CF6',
      baseFreq: 528,
      binauralFreq: 40,
      x: 200, 
      y: 150,
      description: 'Present Moment Alignment',
      icon: '◉'
    },
    { 
      id: 'future', 
      color: '#14B8A6',
      baseFreq: 963,
      binauralFreq: 12,
      x: 300, 
      y: 200,
      description: 'Future Timeline Potential',
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
      setResonanceLevel(0); // Reset resonance level for new selection
    }
  };

  // Animation loop with enhanced visual-audio sync
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

  // Modified resonance effect and card reveal
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && selectedPosition && !cardData[selectedPosition.id]) {
      interval = setInterval(() => {
        setResonanceLevel(prev => {
          // Slower resonance build-up
          const newLevel = Math.min(prev + 0.005, 1);
          if (newLevel >= 1) {
            // Select and reveal card
            const card = selectRandomCard(time);
            setCardData(prev => ({
              ...prev,
              [selectedPosition.id]: card
            }));
            // Don't stop the audio immediately
            setTimeout(() => {
              stopAudio();
              setIsRunning(false);
            }, 1000); // Let the audio play for 1 more second after card reveal
          }
          return newLevel;
        });
      }, 50); // Faster update interval for smoother animation
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedPosition, time]);

  // Cleanup on unmount
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
      </div>
    </div>
  );
};

export default QuantumTarot;
