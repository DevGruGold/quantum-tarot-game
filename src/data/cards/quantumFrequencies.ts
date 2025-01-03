export const frequencies = {
  past: {
    base: 432, // Earth frequency
    binaural: 7.83, // Schumann resonance
    harmonic: 396 // Root chakra
  },
  present: {
    base: 528, // DNA repair frequency
    binaural: 10.5, // Mental clarity
    harmonic: 417 // Facilitating change
  },
  future: {
    base: 639, // Heart frequency
    binaural: 12, // Beta state for focus
    harmonic: 741 // Awakening intuition
  }
};

export const getQuantumHarmony = (position: string, time: number) => {
  const baseFreq = frequencies[position as keyof typeof frequencies]?.base || 432;
  const harmonicFreq = frequencies[position as keyof typeof frequencies]?.harmonic || 396;
  
  // Create harmonic overtones based on time
  return {
    fundamental: baseFreq,
    harmonic: harmonicFreq * (1 + Math.sin(time * 0.1) * 0.01),
    binaural: frequencies[position as keyof typeof frequencies]?.binaural || 7.83
  };
};