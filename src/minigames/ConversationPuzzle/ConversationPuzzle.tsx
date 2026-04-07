// ─── Conversation Puzzle ──────────────────────────────────────────────────────
// Fill-in-the-blank mechanic.
// A sentence template is shown with ____ gaps.
// Word chips are scattered below — tap one to fill the next blank.
// Tap a filled blank to pop the word back to the pool.
// When all blanks are filled correctly the scene completes.

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, spacing } from '../../theme';
import { SentenceChallenge } from '../../types/story';
import CharacterSprite from '../../components/Character/CharacterSprite';

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Split template into parts: alternating text | blank
function parseTemplate(template: string): string[] {
  return template.split('____');
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface Chip {
  id: string;
  word: string;
  placed: boolean; // true when sitting in a blank
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  sentences?: SentenceChallenge[];
  onComplete: () => void;
}

const defaultSentences: SentenceChallenge[] = [
  {
    template: 'I couldn\'t help but ____.',
    answers: ['notice'],
    distractors: ['stare', 'laugh', 'wonder', 'speak'],
  },
];

export default function ConversationPuzzle({ sentences = defaultSentences, onComplete }: Props) {
  const { palette: p } = useEmotion();
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const sentence = sentences[sentenceIdx];

  const handleSentenceDone = () => {
    const next = sentenceIdx + 1;
    setCompletedCount(completedCount + 1);
    if (next >= sentences.length) {
      setTimeout(onComplete, 600);
    } else {
      setTimeout(() => setSentenceIdx(next), 400);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: spacing.xxl,
      gap: spacing.xl,
      overflow: 'hidden',
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: spacing.sm }}>
        {sentences.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background: i < completedCount ? p.accent : i === sentenceIdx ? p.accentMid : p.accentSoft,
              scale: i === sentenceIdx ? 1.3 : 1,
            }}
            style={{ width: 6, height: 6, borderRadius: '50%' }}
          />
        ))}
      </div>

      {/* Sentence challenge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sentenceIdx}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 380, padding: `0 ${spacing.lg}px`, display: 'flex', flexDirection: 'column', gap: spacing.xl }}
        >
          {sentence.speaker && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing.sm }}>
              <CharacterSprite
                characterId={sentence.speaker}
                expression={sentence.expression ?? 'neutral'}
                size={80}
              />
            </div>
          )}
          <SentenceFill
            sentence={sentence}
            palette={p}
            onComplete={handleSentenceDone}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Sentence Fill ──────────────────────────────────────────────────────────────

interface SFProps {
  sentence: SentenceChallenge;
  palette: ReturnType<typeof useEmotion>['palette'];
  onComplete: () => void;
}

function SentenceFill({ sentence, palette: p, onComplete }: SFProps) {
  const parts = useMemo(() => parseTemplate(sentence.template), [sentence.template]);
  const blankCount = parts.length - 1;

  // blanks[i] = chip id sitting in blank i, or null
  const [blanks, setBlanks] = useState<(string | null)[]>(() => Array(blankCount).fill(null));

  // chips: all words (answers + distractors) shuffled
  const [chips, setChips] = useState<Chip[]>(() =>
    shuffle([...sentence.answers, ...sentence.distractors]).map((w, i) => ({
      id: `chip-${i}`,
      word: w,
      placed: false,
    }))
  );

  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);

  const nextEmpty = blanks.findIndex(b => b === null);

  const tapChip = (chip: Chip) => {
    if (chip.placed || done) return;
    if (nextEmpty === -1) return;

    // Place chip in next blank
    setChips(prev => prev.map(c => c.id === chip.id ? { ...c, placed: true } : c));
    const newBlanks = [...blanks];
    newBlanks[nextEmpty] = chip.id;
    setBlanks(newBlanks);

    // Check if done
    const allFilled = newBlanks.every(b => b !== null);
    if (allFilled) {
      // Validate
      const correct = newBlanks.every((cid, idx) => {
        const found = chips.find(c => c.id === cid);
        return found?.word === sentence.answers[idx];
      });
      if (correct) {
        setDone(true);
        setTimeout(onComplete, 500);
      } else {
        // Wrong — shake and reset
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setBlanks(Array(blankCount).fill(null));
          setChips(prev => prev.map(c => ({ ...c, placed: false })));
        }, 600);
      }
    }
  };

  const tapBlank = (blankIdx: number) => {
    if (done) return;
    const cid = blanks[blankIdx];
    if (!cid) return;
    // Pop word back to pool
    const newBlanks = [...blanks];
    newBlanks[blankIdx] = null;
    setBlanks(newBlanks);
    setChips(prev => prev.map(c => c.id === cid ? { ...c, placed: false } : c));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl, alignItems: 'center' }}>
      {/* Sentence with blanks */}
      <motion.div
        animate={shake ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          fontFamily: fonts.serif,
          fontSize: 16,
          lineHeight: 2.4,
          color: p.text,
          textAlign: 'center',
          textTransform: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {parts.map((part, idx) => (
          <span key={idx} style={{ display: 'contents' }}>
            {part && <span style={{ whiteSpace: 'pre-wrap' }}>{part}</span>}
            {idx < blankCount && (
              <Blank
                chipId={blanks[idx]}
                chips={chips}
                palette={p}
                onClick={() => tapBlank(idx)}
                done={done}
              />
            )}
          </span>
        ))}
      </motion.div>

      {/* Hint */}
      {!done && (
        <p style={{
          fontFamily: fonts.sans,
          fontSize: 11,
          letterSpacing: '0.15em',
          color: p.textSoft,
          opacity: 0.55,
          textAlign: 'center',
        }}>
          {blanks.every(b => b === null) ? 'tap a word to place it' : blanks.some(b => b === null) ? `${blanks.filter(b => b !== null).length} / ${blankCount} filled` : ''}
        </p>
      )}

      {/* Word chip pool */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.sm,
        justifyContent: 'center',
        padding: `${spacing.md}px ${spacing.sm}px`,
      }}>
        {chips.map(chip => (
          <WordChip
            key={chip.id}
            chip={chip}
            palette={p}
            onClick={() => tapChip(chip)}
            done={done}
          />
        ))}
      </div>
    </div>
  );
}

// ── Blank Slot ─────────────────────────────────────────────────────────────────

interface BlankProps {
  chipId: string | null;
  chips: Chip[];
  palette: ReturnType<typeof useEmotion>['palette'];
  onClick: () => void;
  done: boolean;
}

function Blank({ chipId, chips, palette: p, onClick, done }: BlankProps) {
  const chip = chipId ? chips.find(c => c.id === chipId) : null;

  return (
    <motion.button
      onClick={onClick}
      whileTap={chip && !done ? { scale: 0.94 } : {}}
      animate={{
        background: done && chip ? p.accent : chip ? p.accentSoft : 'transparent',
        borderColor: done ? p.accent : chip ? p.accentMid : p.textSoft,
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: chip ? 'auto' : 64,
        height: 30,
        padding: chip ? '0 10px' : '0',
        borderRadius: 6,
        border: `1.5px solid`,
        background: 'transparent',
        cursor: chip && !done ? 'pointer' : 'default',
        fontFamily: fonts.serif,
        fontSize: 15,
        color: done ? p.panelBg : p.text,
        transition: 'background 0.3s, border-color 0.3s, color 0.3s',
        verticalAlign: 'middle',
        position: 'relative',
        top: -1,
      }}
    >
      {chip ? chip.word : <span style={{ opacity: 0.3, fontSize: 11 }}>____</span>}
    </motion.button>
  );
}

// ── Word Chip ──────────────────────────────────────────────────────────────────

interface ChipProps {
  chip: Chip;
  palette: ReturnType<typeof useEmotion>['palette'];
  onClick: () => void;
  done: boolean;
}

function WordChip({ chip, palette: p, onClick, done }: ChipProps) {
  return (
    <AnimatePresence>
      {!chip.placed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.75, y: -6 }}
          transition={{ type: 'spring', damping: 16, stiffness: 280 }}
          whileHover={!done ? { scale: 1.06 } : {}}
          whileTap={!done ? { scale: 0.93 } : {}}
          onClick={onClick}
          style={{
            padding: `${spacing.xs + 2}px ${spacing.md}px`,
            borderRadius: 20,
            border: 'none',
            background: p.panelBg,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontFamily: fonts.serif,
            fontSize: 14,
            color: p.text,
            cursor: done ? 'default' : 'pointer',
          }}
        >
          {chip.word}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
