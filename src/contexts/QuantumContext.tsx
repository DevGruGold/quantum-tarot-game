import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initializeAudioContext, createOscillators } from '@/utils/audioUtils';
import { selectRandomCard } from '@/utils/cardUtils';
import { useToast } from "@/components/ui/use-toast";
import { getZodiacSign } from '@/utils/astroUtils';

interface QuantumContextType {
  isRunning: boolean;
  time: number;
  selectedPosition: any;
  volume: number;
  audioInitialized: boolean;
  resonanceLevel: number;
  cardData: Record<string, any>;
  thumbsPlaced: { left: boolean; right: boolean };
  birthDate: string;
  secondBirthDate: string;
  zodiacSign: string;
  secondZodiacSign: string;
  language: string;
  setLanguage: (lang: string) => void;
  handleBirthDateSubmit: (date: string, secondDate?: string) => void;
  handlePositionSelect: (position: any) => void;
  handleThumbPlacement: (side: 'left' | 'right') => void;
  initializeAudio: () => Promise<void>;
  setVolume: (vol: number) => void;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export const useQuantum = () => {
  const context = useContext(QuantumContext);
  if (!context) {
    throw new Error('useQuantum must be used within a QuantumProvider');
  }
  return context;
};

export const QuantumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [volume, setVolume] = useState(0.3);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [resonanceLevel, setResonanceLevel] = useState(0);
  const [cardData, setCardData] = useState<Record<string, any>>({});
  const [thumbsPlaced, setThumbsPlaced] = useState({ left: false, right: false });
  const [birthDate, setBirthDate] = useState('');
  const [secondBirthDate, setSecondBirthDate] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [secondZodiacSign, setSecondZodiacSign] = useState('');
  const [language, setLanguage] = useState('en');

  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<any>({ left: null, right: null });
  const gainNodeRef = useRef<any>(null);

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

  const handleBirthDateSubmit = (date: string, secondDate?: string) => {
    setBirthDate(date);
    if (secondDate !== undefined) {
      setSecondBirthDate(secondDate);
    }
    
    if (date) {
      const sign = getZodiacSign(date);
      setZodiacSign(sign);
    }
    
    if (secondDate) {
      const secondSign = getZodiacSign(secondDate);
      setSecondZodiacSign(secondSign);
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
    }
  };

  const initializeAudio = async () => {
    const context = await initializeAudioContext();
    if (context) {
      audioContextRef.current = context;
      setAudioInitialized(true);
    }
  };

  const handleThumbPlacement = (side: 'left' | 'right') => {
    setThumbsPlaced(prev => ({ ...prev, [side]: !prev[side] }));
  };

  // Animation and resonance effects
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

  // Cleanup
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const value = {
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
    setLanguage,
    handleBirthDateSubmit,
    handlePositionSelect,
    handleThumbPlacement,
    initializeAudio,
    setVolume,
  };

  return (
    <QuantumContext.Provider value={value}>
      {children}
    </QuantumContext.Provider>
  );
};