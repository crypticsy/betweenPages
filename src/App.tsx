import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoryEngineProvider } from './systems/StoryEngine';
import TitleScreen from './screens/TitleScreen/TitleScreen';
import GameScreen from './screens/GameScreen/GameScreen';
import { MAIN_STORY } from './data/stories';

type Screen = 'title' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <StoryEngineProvider story={MAIN_STORY}>
        <AnimatePresence mode="wait">
          {screen === 'title' ? (
            <div key="title" style={{ position: 'absolute', inset: 0 }}>
              <TitleScreen story={MAIN_STORY} onStart={() => setScreen('game')} />
            </div>
          ) : (
            <div key="game" style={{ position: 'absolute', inset: 0 }}>
              <GameScreen onExit={() => setScreen('title')} />
            </div>
          )}
        </AnimatePresence>
      </StoryEngineProvider>
    </div>
  );
}
