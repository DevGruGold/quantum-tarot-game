import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { tarotDeck } from '@/data/tarotDeck';
import { initializeAudioContext, createOscillators } from '@/utils/audioUtils';

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

  // Card selection with quantum entropy
  const selectRandomCard = (timePosition: string) => {
    const PHI = 1.618033988749895;
    const entropy = Number(time) + performance.now();
    const cardIndex = Math.floor(Math.abs(Math.sin(entropy * PHI)) * tarotDeck.major.length);
    return tarotDeck.major[cardIndex];
  };

  const handlePositionSelect = (position) => {
    if (selectedPosition?.id === position.id) {
      setSelectedPosition(null);
      setIsRunning(false);
      stopAudio();
      setResonanceLevel(0);
    } else {
      setSelectedPosition(position);
      setIsRunning(true);
      startAudio(position);
    }
  };

  // Animation loop
  useEffect(() => {
    let frameId;
    if (isRunning) {
      const animate = () => {
        setTime(t => (t + 0.02) % (Math.PI * 2));
        frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isRunning]);

  // Resonance effect and card reveal
  useEffect(() => {
    let interval;
    if (isRunning && selectedPosition && !cardData[selectedPosition.id]) {
      interval = setInterval(() => {
        setResonanceLevel(prev => {
          const newLevel = Math.min(prev + 0.02, 1);
          if (newLevel >= 1) {
            // Select and reveal card
            const card = selectRandomCard(selectedPosition.id);
            setCardData(prev => ({
              ...prev,
              [selectedPosition.id]: card
            }));
            stopAudio();
            setIsRunning(false);
          }
          return newLevel;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedPosition]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 mb-2">
          Quantum Tarot™
        </h1>
        <p className="text-gray-400">
          Harmonically Aligned Timeline Reading
        </p>
      </div>

      <Card className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-200">
              Frequency Alignment Interface
            </CardTitle>
            <div className="flex items-center space-x-4">
              <button
                onClick={initializeAudio}
                className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 text-purple-300 rounded-lg 
                         hover:bg-purple-600/30 transition-all duration-300 flex items-center space-x-2"
              >
                <span className="text-lg">🎧</span>
                <span>{audioInitialized ? "Audio Ready" : "Initialize Audio"}</span>
              </button>
              <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-400">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={(e) => setVolume(e.target.value / 100)}
                  className="w-24 accent-purple-500"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden 
                          border border-gray-800 shadow-xl">
              <svg width="100%" height="100%" className="w-full" preserveAspectRatio="xMidYMid meet">
                {positions.map((pos) => {
                  const vibration = selectedPosition?.id === pos.id 
                    ? Math.sin(time * pos.baseFreq/100) * 5 
                    : 0;

                  return (
                    <g 
                      key={pos.id}
                      transform={`translate(${pos.x + vibration}, ${pos.y})`}
                      onClick={() => handlePositionSelect(pos)}
                      className="cursor-pointer"
                    >
                      <rect
                        x="-30"
                        y="-45"
                        width="60"
                        height="90"
                        rx="4"
                        fill={pos.color}
                        opacity={cardData[pos.id] ? "0.8" : selectedPosition?.id === pos.id ? "0.4" : "0.1"}
                        stroke={pos.color}
                        strokeWidth="2"
                      />
                      
                      {selectedPosition?.id === pos.id && !cardData[pos.id] && (
                        <>
                          <circle
                            r={20 + Math.sin(time * 5) * 5}
                            fill="none"
                            stroke={pos.color}
                            strokeWidth="1"
                            opacity="0.3"
                          >
                            <animate
                              attributeName="r"
                              values="20;25;20"
                              dur="1s"
                              repeatCount="indefinite"
                            />
                          </circle>
                          
                          <rect
                            x="-20"
                            y="35"
                            width="40"
                            height="4"
                            fill="none"
                            stroke={pos.color}
                            strokeWidth="1"
                          />
                          <rect
                            x="-20"
                            y="35"
                            width={40 * resonanceLevel}
                            height="4"
                            fill={pos.color}
                            opacity="0.8"
                          />
                        </>
                      )}

                      {cardData[pos.id] && (
                        <text
                          y="-20"
                          textAnchor="middle"
                          fill="white"
                          fontSize="8"
                        >
                          {cardData[pos.id].name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {positions.map(pos => (
                <div 
                  key={pos.id}
                  className={`p-4 rounded-lg border transition-all duration-300
                    ${selectedPosition?.id === pos.id 
                      ? 'bg-gray-800/80 border-gray-700' 
                      : 'bg-gray-800/20 border-gray-800'}`}
                >
                  <div className="font-bold mb-2" style={{ color: pos.color }}>
                    {pos.id.toUpperCase()}
                  </div>
                  
                  {cardData[pos.id] ? (
                    <div className="space-y-2 text-sm">
                      <div className="text-white font-medium">
                        {cardData[pos.id].name}
                      </div>
                      <div className="text-purple-300/80">
                        {cardData[pos.id].quantum}
                      </div>
                      <div className="text-blue-300/80">
                        {cardData[pos.id].astro}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      {selectedPosition?.id === pos.id 
                        ? `Aligning to ${pos.baseFreq}Hz...`
                        : pos.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuantumTarot;
