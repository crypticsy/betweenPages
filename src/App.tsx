import { useState, useRef, useEffect } from 'react';
import { StoryEngineProvider } from './systems/StoryEngine';
import TitleScreen from './screens/TitleScreen/TitleScreen';
import GameScreen from './screens/GameScreen/GameScreen';
import BurnTransition from './components/BurnTransition/BurnTransition';
import { MAIN_STORY } from './data/stories';

import backgroundMusic from './assets/music/welc0mei0-240508-piano-retro-fairytail-239358.mp3';

type Screen = 'title' | 'game';

export default function App() {
  const [screen, setScreen]   = useState<Screen>('title');
  const [burning, setBurning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
      }
    };

    window.addEventListener('click', playAudio, { once: true });
    window.addEventListener('touchstart', playAudio, { once: true });

    return () => {
      window.removeEventListener('click', playAudio);
      window.removeEventListener('touchstart', playAudio);
    };
  }, []);

  function handleStart() {
    if (burning) return;
    setBurning(true);
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
    }
  }

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop />
      <StoryEngineProvider story={MAIN_STORY}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {screen === 'title' ? (
            <TitleScreen story={MAIN_STORY} onStart={handleStart} />
          ) : (
            <GameScreen onExit={() => setScreen('title')} />
          )}
        </div>

        {/* Burn overlay — sits above everything, fires at screen boundary */}
        {/* burnColor matches the game screen's pageBg so the overlay vanishes seamlessly */}
        <BurnTransition
          active={burning}
          burnColor="#f0ede8"
          fireInner='#babab8'
          fireOuter='#ffffff'
          onMidpoint={() => setScreen('game')}
          onComplete={() => setBurning(false)}
        />
      </StoryEngineProvider>
    </div>
  );
}
