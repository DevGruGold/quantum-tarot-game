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
    <div className="container-fluid min-vh-100 bg-gradient-to-b from-gray-900 to-gray-800 text-light py-4">
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8 text-center">
          <h1 className="display-4 fw-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400">
            Quantum Tarot™
          </h1>
          <p className="text-muted">
            Harmonically Aligned Timeline Reading
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <Card className="bg-dark bg-opacity-50 backdrop-blur border-dark">
            <CardHeader>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <CardTitle className="h4 text-light mb-0">
                  Frequency Alignment Interface
                </CardTitle>
                <div className="d-flex align-items-center gap-3">
                  <button
                    onClick={initializeAudio}
                    className="btn btn-outline-purple d-flex align-items-center gap-2"
                  >
                    <span className="fs-5">🎧</span>
                    <span>{audioInitialized ? "Audio Ready" : "Initialize Audio"}</span>
                  </button>
                  <div className="d-flex align-items-center gap-2 bg-dark bg-opacity-50 rounded p-2">
                    <span className="small text-muted">Vol</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={(e) => setVolume(Number(e.target.value) / 100)}
                      className="form-range"
                      style={{ width: '100px' }}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="d-flex flex-column gap-4">
                <div className="position-relative ratio ratio-16x9 bg-dark rounded-3 overflow-hidden border border-dark shadow">
                  <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
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
                          style={{ transition: 'transform 0.3s ease' }}
                        >
                          <rect
                            x="-40"
                            y="-60"
                            width="80"
                            height="120"
                            rx="6"
                            fill={pos.color}
                            opacity={cardData[pos.id] ? "0.8" : selectedPosition?.id === pos.id ? "0.4" : "0.1"}
                            stroke={pos.color}
                            strokeWidth="2"
                          />
                          
                          {selectedPosition?.id === pos.id && !cardData[pos.id] && (
                            <>
                              <circle
                                r={25 + Math.sin(time * 5) * 8}
                                fill="none"
                                stroke={pos.color}
                                strokeWidth="1.5"
                                opacity="0.3"
                              >
                                <animate
                                  attributeName="r"
                                  values="25;32;25"
                                  dur="1.5s"
                                  repeatCount="indefinite"
                                />
                              </circle>
                              
                              <rect
                                x="-25"
                                y="45"
                                width="50"
                                height="5"
                                fill="none"
                                stroke={pos.color}
                                strokeWidth="1.5"
                              />
                              <rect
                                x="-25"
                                y="45"
                                width={50 * resonanceLevel}
                                height="5"
                                fill={pos.color}
                                opacity="0.8"
                              />
                            </>
                          )}

                          {cardData[pos.id] && (
                            <>
                              <text
                                y="-30"
                                textAnchor="middle"
                                fill="white"
                                fontSize="12"
                                className="font-bold"
                              >
                                {cardData[pos.id].name}
                              </text>
                              <text
                                y="0"
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                opacity="0.8"
                              >
                                {pos.icon}
                              </text>
                            </>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="row g-4">
                  {positions.map(pos => (
                    <div key={pos.id} className="col-12 col-md-4">
                      <div 
                        className={`card h-100 border ${
                          selectedPosition?.id === pos.id 
                            ? 'bg-dark bg-opacity-80 border-secondary' 
                            : 'bg-dark bg-opacity-20 border-dark'
                        }`}
                      >
                        <div className="card-body">
                          <h5 className="card-title" style={{ color: pos.color }}>
                            {pos.id.toUpperCase()}
                          </h5>
                          
                          {cardData[pos.id] ? (
                            <div className="d-flex flex-column gap-2">
                              <div className="fw-bold text-white">
                                {cardData[pos.id].name}
                              </div>
                              <div className="small text-purple-300">
                                {cardData[pos.id].quantum}
                              </div>
                              <div className="small text-info">
                                {cardData[pos.id].astro}
                              </div>
                            </div>
                          ) : (
                            <p className="card-text text-muted small mb-0">
                              {selectedPosition?.id === pos.id 
                                ? `Aligning to ${pos.baseFreq}Hz...`
                                : pos.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuantumTarot;