import { useState, useRef, useEffect } from 'react';
import { StoryEngineProvider, useStory } from './systems/StoryEngine';
import TitleScreen from './screens/TitleScreen/TitleScreen';
import GameScreen from './screens/GameScreen/GameScreen';
import BurnTransition from './components/BurnTransition/BurnTransition';
import { MAIN_STORY } from './data/stories';

import backgroundMusic from './assets/music/welc0mei0-240508-piano-retro-fairytail-239358.mp3';

type Screen = 'title' | 'game';

function Main() {
  const [screen, setScreen] = useState<Screen>('title');
  const [burning, setBurning] = useState(false);
  const [targetScreen, setTargetScreen] = useState<Screen>('game');
  const { resetStory } = useStory();

  function handleStart() {
    if (burning) return;
    setTargetScreen('game');
    setBurning(true);
  }

  function handleExit() {
    if (burning) return;
    setTargetScreen('title');
    setBurning(true);
  }

  function handleMidpoint() {
    setScreen(targetScreen);
    if (targetScreen === 'title') {
      resetStory();
    }
  }

  return (
    <>
      <div style={{ position: 'absolute', inset: 0 }}>
        {screen === 'title' ? (
          <TitleScreen story={MAIN_STORY} onStart={handleStart} />
        ) : (
          <GameScreen onExit={handleExit} />
        )}
      </div>

      <BurnTransition
        active={burning}
        burnColor="#f0ede8"
        fireInner="#babab8"
        fireOuter="#ffffff"
        onMidpoint={handleMidpoint}
        onComplete={() => setBurning(false)}
      />
    </>
  );
}

export default function App() {
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

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop />
      <StoryEngineProvider story={MAIN_STORY}>
        <Main />
      </StoryEngineProvider>
    </div>
  );
}
