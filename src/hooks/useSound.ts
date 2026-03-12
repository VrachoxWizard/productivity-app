import { useCallback } from 'react';

const sounds = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  pop: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
};

export function useSound() {
  const playSound = useCallback((type: keyof typeof sounds) => {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.2;
    audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
  }, []);

  return { playSound };
}
