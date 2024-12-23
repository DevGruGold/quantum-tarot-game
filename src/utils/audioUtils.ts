export const initializeAudioContext = async () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const context = new AudioContext();
    await context.resume();
    return context;
  } catch (error) {
    console.error("Audio initialization failed:", error);
    return null;
  }
};

export const createOscillators = (
  audioContext: AudioContext,
  position: { baseFreq: number; binauralFreq: number },
  volume: number
) => {
  // Create oscillators with enhanced harmonic overtones
  const leftOsc = audioContext.createOscillator();
  const rightOsc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Create filters for richer harmonics
  const leftFilter = audioContext.createBiquadFilter();
  const rightFilter = audioContext.createBiquadFilter();
  
  leftFilter.type = 'lowpass';
  rightFilter.type = 'lowpass';
  leftFilter.frequency.value = position.baseFreq * 2;
  rightFilter.frequency.value = (position.baseFreq + position.binauralFreq) * 2;

  // Create stereo panning
  const leftPanner = audioContext.createStereoPanner();
  const rightPanner = audioContext.createStereoPanner();
  leftPanner.pan.value = -1;
  rightPanner.pan.value = 1;

  // Set frequencies with slight detuning for richer sound
  leftOsc.frequency.setValueAtTime(position.baseFreq, audioContext.currentTime);
  rightOsc.frequency.setValueAtTime(
    position.baseFreq + position.binauralFreq,
    audioContext.currentTime
  );

  // Gradual volume ramp for smoother transitions
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.5);

  // Connect the audio graph with filters
  leftOsc.connect(leftFilter);
  rightOsc.connect(rightFilter);
  leftFilter.connect(leftPanner);
  rightFilter.connect(rightPanner);
  leftPanner.connect(gainNode);
  rightPanner.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { leftOsc, rightOsc, gainNode };
};