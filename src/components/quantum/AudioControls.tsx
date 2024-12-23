import React from 'react';

interface AudioControlsProps {
  initializeAudio: () => void;
  audioInitialized: boolean;
  volume: number;
  setVolume: (volume: number) => void;
}

const AudioControls = ({ initializeAudio, audioInitialized, volume, setVolume }: AudioControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-2xl md:text-3xl text-purple-100 font-light">
        Frequency Alignment Interface
      </div>
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
  );
};

export default AudioControls;