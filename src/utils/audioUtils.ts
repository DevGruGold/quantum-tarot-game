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
  position: any,
  volume: number
) => {
  const leftOsc = audioContext.createOscillator();
  const rightOsc = audioContext.createOscillator();
  const harmonicOsc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const harmonicGain = audioContext.createGain();

  // Create filters for richer harmonics
  const leftFilter = audioContext.createBiquadFilter();
  const rightFilter = audioContext.createBiquadFilter();
  const harmonicFilter = audioContext.createBiquadFilter();
  
  leftFilter.type = 'lowpass';
  rightFilter.type = 'lowpass';
  harmonicFilter.type = 'bandpass';
  
  leftFilter.frequency.value = position.baseFreq * 2;
  rightFilter.frequency.value = (position.baseFreq + position.binauralFreq) * 2;
  harmonicFilter.frequency.value = position.baseFreq * 1.5;

  // Set up stereo panning
  const leftPanner = audioContext.createStereoPanner();
  const rightPanner = audioContext.createStereoPanner();
  leftPanner.pan.value = -0.8;
  rightPanner.pan.value = 0.8;

  // Set frequencies
  leftOsc.frequency.setValueAtTime(position.baseFreq, audioContext.currentTime);
  rightOsc.frequency.setValueAtTime(
    position.baseFreq + position.binauralFreq,
    audioContext.currentTime
  );
  harmonicOsc.frequency.setValueAtTime(
    position.baseFreq * 1.5,
    audioContext.currentTime
  );

  // Set volumes
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, audioContext.currentTime + 0.5);
  
  harmonicGain.gain.setValueAtTime(0, audioContext.currentTime);
  harmonicGain.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.5);

  // Connect the audio graph
  leftOsc.connect(leftFilter);
  rightOsc.connect(rightFilter);
  harmonicOsc.connect(harmonicFilter);
  
  leftFilter.connect(leftPanner);
  rightFilter.connect(rightPanner);
  harmonicFilter.connect(gainNode);
  
  leftPanner.connect(gainNode);
  rightPanner.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { leftOsc, rightOsc, harmonicOsc, gainNode };
};