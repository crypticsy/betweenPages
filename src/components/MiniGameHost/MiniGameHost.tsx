import { motion } from 'framer-motion';
import { MiniGameScene } from '../../types/story';
import { useStory } from '../../systems/StoryEngine';
import { useEmotion } from '../../systems/EmotionContext';
import ConversationPuzzle from '../../minigames/ConversationPuzzle/ConversationPuzzle';
import BreathingGame from '../../minigames/BreathingGame/BreathingGame';
import MatchingGame from '../../minigames/MatchingGame/MatchingGame';
import PolaroidGame from '../../minigames/PolaroidGame/PolaroidGame';

export default function MiniGameHost({ scene }: { scene: MiniGameScene }) {
  const { advanceScene } = useStory();
  const { palette: p } = useEmotion();
  const cfg = scene.config;

  return (
    <motion.div
      initial={{ opacity: 0, y: '30vh' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={{ flex: 1, display: 'flex', background: p.pageBg, overflow: 'hidden' }}
    >
      {scene.type === 'conversation_puzzle' && (
        <ConversationPuzzle
          sentences={cfg.sentences}
          onComplete={advanceScene}
        />
      )}
      {scene.type === 'breathing' && (
        <BreathingGame cycles={cfg.cycles ?? 3} onComplete={advanceScene} />
      )}
      {scene.type === 'matching' && cfg.pairs && (
        <MatchingGame pairs={cfg.pairs} onComplete={advanceScene} />
      )}
      {scene.type === 'polaroid' && cfg.imagePairs && (
        <PolaroidGame imagePairs={cfg.imagePairs} onComplete={advanceScene} />
      )}
    </motion.div>
  );
}
