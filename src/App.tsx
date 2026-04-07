import { useState, useRef, useEffect } from 'react';
import { StoryEngineProvider, useStory } from './systems/StoryEngine';
import TitleScreen from './screens/TitleScreen/TitleScreen';
import GameScreen from './screens/GameScreen/GameScreen';
import BurnTransition from './components/BurnTransition/BurnTransition';
import { MAIN_STORY } from './data/stories';
import { HiVolumeUp, HiVolumeOff, HiHome } from 'react-icons/hi';
import { FaPhotoVideo } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterMenu from './components/ChapterMenu/ChapterMenu';

import backgroundMusic from './assets/music/welc0mei0-240508-piano-retro-fairytail-239358.mp3';

type Screen = 'title' | 'game';

interface MainProps {
  screen: Screen;
  onStart: () => void;
  onExit: () => void;
}

function Main({ screen, onStart, onExit }: MainProps) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {screen === 'title' ? (
        <TitleScreen story={MAIN_STORY} onStart={onStart} />
      ) : (
        <GameScreen onExit={onExit} />
      )}
    </div>
  );
}

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [screen, setScreen] = useState<Screen>('title');

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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      <audio ref={audioRef} src={backgroundMusic} autoPlay loop muted={isMuted} />
      
      <StoryEngineProvider story={MAIN_STORY}>
        <InnerApp 
          screen={screen} 
          setScreen={setScreen} 
          isMuted={isMuted} 
          onToggleMute={toggleMute} 
        />
      </StoryEngineProvider>
    </div>
  );
}

interface InnerAppProps {
  screen: Screen;
  setScreen: (s: Screen) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

function InnerApp({ screen, setScreen, isMuted, onToggleMute }: InnerAppProps) {
  const { story, chapter, jumpToChapter, resetStory, completedChapters } = useStory();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [burning, setBurning] = useState(false);
  const [targetScreen, setTargetScreen] = useState<Screen>('game');

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
      <Main 
        screen={screen} 
        onStart={handleStart} 
        onExit={handleExit} 
      />

      <BurnTransition
        active={burning}
        burnColor="#f0ede8"
        fireInner="#babab8"
        fireOuter="#ffffff"
        onMidpoint={handleMidpoint}
        onComplete={() => setBurning(false)}
      />

      {/* Top-Right Controls — Rendered AFTER Main/Transition for z-index safety */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '25px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '12px'
      }}>
        {/* Volume Button */}
        <motion.button
          onClick={onToggleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'none',
            backdropFilter: 'none',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: screen === 'title' ? 'white' : '#2A2018',
            boxShadow: 'none',
          }}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isMuted ? 'muted' : 'unmuted'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              {isMuted ? <HiVolumeOff size={28} /> : <HiVolumeUp size={28} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* Chapter Menu Button */}
        <motion.button
          onClick={() => setIsMenuOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'none',
            backdropFilter: 'none',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: screen === 'title' ? 'white' : '#2A2018',
            boxShadow: 'none',
          }}
          aria-label="Chapter Menu"
        >
          <div style={{ display: 'flex' }}>
            <FaPhotoVideo size={20} />
          </div>
        </motion.button>


        {/* Home Button (Game Screen Only) */}
        {screen === 'game' && (
          <motion.button
            onClick={handleExit}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'none',
              backdropFilter: 'none',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#2A2018',
              boxShadow: 'none',
            }}
            aria-label="Back to Home"
          >
            <div style={{ display: 'flex' }}>
              <HiHome size={24} />
            </div>
          </motion.button>
        )}
      </div>

      <ChapterMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        chapters={story.chapters}
        onJumpToChapter={jumpToChapter}
        currentChapterId={chapter?.id}
        completedChapters={completedChapters}
      />
    </>
  );
}
