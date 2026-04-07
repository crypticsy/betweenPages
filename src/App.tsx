import { useState } from 'react';
import { StoryEngineProvider } from './systems/StoryEngine';
import TitleScreen from './screens/TitleScreen/TitleScreen';
import GameScreen from './screens/GameScreen/GameScreen';
import BurnTransition from './components/BurnTransition/BurnTransition';
import { MAIN_STORY } from './data/stories';

type Screen = 'title' | 'game';

export default function App() {
  const [screen, setScreen]   = useState<Screen>('title');
  const [burning, setBurning] = useState(false);

  function handleStart() {
    if (burning) return;
    setBurning(true);
  }

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
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
