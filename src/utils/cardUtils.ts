import { tarotDeck } from '@/data/tarotDeck';

export const selectRandomCard = (time: number) => {
  const PHI = 1.618033988749895;
  const entropy = time + performance.now();
  const cardIndex = Math.floor(Math.abs(Math.sin(entropy * PHI)) * tarotDeck.major.length);
  return tarotDeck.major[cardIndex];
};