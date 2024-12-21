import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { tarotDeck } from '@/data/tarotDeck';
import { initializeAudioContext, createOscillators } from '@/utils/audioUtils';
import { selectRandomCard } from '@/utils/cardUtils';
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
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 mb-4 quantum-pulse">
            Quantum Tarot™
          </h1>
          <p className="text-lg text-purple-200 opacity-80">
            Harmonically Aligned Timeline Reading
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
          <CardHeader className="border-b border-purple-500/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <CardTitle className="text-2xl md:text-3xl text-purple-100 font-light">
                Frequency Alignment Interface
              </CardTitle>
              <div className="flex items-center gap-4">
                <button
                  onClick={initializeAudio}
                  className="btn-outline-purple px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:bg-purple-600 hover:text-white"
                >
                  <span className="text-xl">🎧</span>
                  <span>{audioInitialized ? "Audio Ready" : "Initialize Audio"}</span>
                </button>
                <div className="flex items-center gap-2 bg-black/30 rounded-lg p-3">
                  <span className="text-sm text-purple-300">Vol</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={(e) => setVolume(Number(e.target.value) / 100)}
                    className="form-range w-24"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-8">
              <div className="relative aspect-[16/9] bg-black/60 rounded-2xl overflow-hidden border border-purple-500/20 shadow-inner">
                <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <radialGradient id="cardGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
                      <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                    </radialGradient>
                  </defs>
                  
                  {positions.map((pos) => {
                    const vibration = selectedPosition?.id === pos.id 
                      ? Math.sin(time * pos.baseFreq/100) * 5 
                      : 0;

                    return (
                      <g 
                        key={pos.id}
                        transform={`translate(${pos.x + vibration}, ${pos.y})`}
                        onClick={() => handlePositionSelect(pos)}
                        className="cursor-pointer transition-transform duration-300 hover:scale-105"
                      >
                        {/* Background glow */}
                        <circle
                          r="45"
                          fill="url(#cardGlow)"
                          opacity={selectedPosition?.id === pos.id ? "1" : "0.3"}
                        />
                        
                        {/* Card rectangle */}
                        <rect
                          x="-40"
                          y="-60"
                          width="80"
                          height="120"
                          rx="8"
                          fill={pos.color}
                          opacity={cardData[pos.id] ? "0.9" : selectedPosition?.id === pos.id ? "0.4" : "0.1"}
                          stroke={pos.color}
                          strokeWidth="2"
                          className="shadow-lg"
                        />
                        
                        {selectedPosition?.id === pos.id && !cardData[pos.id] && (
                          <>
                            <circle
                              r={25 + Math.sin(time * 5) * 8}
                              fill="none"
                              stroke={pos.color}
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
                                stroke={pos.color}
                                strokeWidth="1"
                                opacity="0.3"
                              />
                              <rect
                                x="-25"
                                y="0"
                                width={50 * resonanceLevel}
                                height="4"
                                rx="2"
                                fill={pos.color}
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

                        {cardData[pos.id] ? (
                          <>
                            <text
                              y="-30"
                              textAnchor="middle"
                              fill="white"
                              fontSize="14"
                              className="font-bold"
                            >
                              {cardData[pos.id].name}
                            </text>
                            <text
                              y="0"
                              textAnchor="middle"
                              fill="white"
                              fontSize="24"
                              opacity="0.9"
                            >
                              {pos.icon}
                            </text>
                          </>
                        ) : (
                          <text
                            y="0"
                            textAnchor="middle"
                            fill="white"
                            fontSize="24"
                            opacity={selectedPosition?.id === pos.id ? "0.9" : "0.5"}
                          >
                            {pos.icon}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {positions.map(pos => (
                  <div key={pos.id} className="card-container">
                    <div 
                      className={`card h-full border rounded-xl p-6 backdrop-blur-sm transition-all ${
                        selectedPosition?.id === pos.id 
                          ? 'bg-purple-900/40 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                          : 'bg-black/20 border-purple-500/10 hover:border-purple-500/30'
                      }`}
                    >
                      <h3 className="text-xl font-semibold mb-4" style={{ color: pos.color }}>
                        {pos.id.toUpperCase()}
                      </h3>
                      
                      {cardData[pos.id] ? (
                        <div className="space-y-3">
                          <div className="text-lg font-bold text-white">
                            {cardData[pos.id].name}
                          </div>
                          <div className="text-sm text-purple-300">
                            {cardData[pos.id].quantum}
                          </div>
                          <div className="text-sm text-teal-300">
                            {cardData[pos.id].astro}
                          </div>
                        </div>
                      ) : (
                        <p className="text-purple-200/60 text-sm">
                          {selectedPosition?.id === pos.id 
                            ? `Aligning to ${pos.baseFreq}Hz...`
                            : pos.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuantumTarot;