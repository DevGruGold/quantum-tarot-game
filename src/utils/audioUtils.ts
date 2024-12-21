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
  const leftOsc = audioContext.createOscillator();
  const rightOsc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  const leftPanner = audioContext.createStereoPanner();
  const rightPanner = audioContext.createStereoPanner();
  leftPanner.pan.value = -1;
  rightPanner.pan.value = 1;

  leftOsc.frequency.setValueAtTime(position.baseFreq, audioContext.currentTime);
  rightOsc.frequency.setValueAtTime(
    position.baseFreq + position.binauralFreq,
    audioContext.currentTime
  );

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

  leftOsc.connect(leftPanner);
  rightOsc.connect(rightPanner);
  leftPanner.connect(gainNode);
  rightPanner.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { leftOsc, rightOsc, gainNode };
};