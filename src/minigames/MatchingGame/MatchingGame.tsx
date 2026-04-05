// ─── Matching Game ────────────────────────────────────────────────────────────
// Tap a left card then a right card to match pairs.
// Right column is shuffled on mount so position gives no hint.

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, radius, shadow, spacing } from '../../theme';

interface Pair { left: string; right: string }
interface Props { pairs: Pair[]; onComplete: () => void }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingGame({ pairs, onComplete }: Props) {
  const { palette: p } = useEmotion();

  // Shuffle right-side display order on mount (never aligned with left)
  // shuffledRight[i] = original pair index
  const shuffledIndices = useMemo(() => {
    let order = pairs.map((_, i) => i);
    // Ensure no card is in the same position as its pair
    do { order = shuffle(order); }
    while (order.some((v, i) => v === i) && pairs.length > 1);
    return order;
  }, [pairs]);

  const [selLeft, setSelLeft]   = useState<number | null>(null);
  const [matched, setMatched]   = useState<Set<number>>(new Set()); // stores pair indices
  const [wrong, setWrong]       = useState(false);

  const pickLeft = useCallback((i: number) => {
    if (matched.has(i)) return;
    setSelLeft(i);
    setWrong(false);
  }, [matched]);

  const pickRight = useCallback((displayIdx: number) => {
    if (selLeft === null) return;
    const pairIdx = shuffledIndices[displayIdx];
    if (matched.has(pairIdx)) return;

    if (selLeft === pairIdx) {
      const next = new Set(matched).add(pairIdx);
      setMatched(next);
      setSelLeft(null);
      if (next.size >= pairs.length) setTimeout(onComplete, 700);
    } else {
      setWrong(true);
      setTimeout(() => { setSelLeft(null); setWrong(false); }, 500);
    }
  }, [selLeft, matched, pairs.length, shuffledIndices, onComplete]);

  const leftCard = (text: string, idx: number) => {
    const isSelected = selLeft === idx;
    const isMatched  = matched.has(idx);
    return (
      <motion.button
        key={`left-${idx}`}
        onClick={() => pickLeft(idx)}
        whileTap={!isMatched ? { scale: 0.95 } : {}}
        animate={{
          background: isMatched ? p.accentSoft : isSelected ? p.accent : p.panelBg,
          opacity: isMatched ? 0.5 : 1,
        }}
        style={{
          border: 'none',
          borderRadius: radius.md,
          padding: `${spacing.md}px ${spacing.md}px`,
          fontFamily: fonts.sans,
          fontSize: 15,
          color: isSelected ? (p.panelBg ?? '#fff') : p.text,
          cursor: isMatched ? 'default' : 'pointer',
          textDecoration: isMatched ? 'line-through' : 'none',
          boxShadow: isSelected ? shadow.lift : shadow.soft,
          minHeight: 52,
          width: '100%',
          textAlign: 'center',
          transition: 'color 0.25s',
        }}
      >
        {text}
      </motion.button>
    );
  };

  const rightCard = (displayIdx: number) => {
    const pairIdx   = shuffledIndices[displayIdx];
    const text      = pairs[pairIdx].right;
    const isMatched = matched.has(pairIdx);
    return (
      <motion.button
        key={`right-${displayIdx}`}
        onClick={() => pickRight(displayIdx)}
        whileTap={!isMatched ? { scale: 0.95 } : {}}
        animate={{
          background: isMatched ? p.accentSoft : p.panelBg,
          opacity: isMatched ? 0.5 : 1,
        }}
        style={{
          border: 'none',
          borderRadius: radius.md,
          padding: `${spacing.md}px ${spacing.md}px`,
          fontFamily: fonts.sans,
          fontSize: 15,
          color: p.text,
          cursor: isMatched ? 'default' : 'pointer',
          textDecoration: isMatched ? 'line-through' : 'none',
          boxShadow: shadow.soft,
          minHeight: 52,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {text}
      </motion.button>
    );
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: spacing.xxl,
      padding: `${spacing.xxl}px ${spacing.xl}px ${spacing.xl}px`,
      gap: spacing.xxl,
    }}>
      <p style={{
        fontFamily: fonts.handwritten,
        fontSize: 16,
        color: p.textSoft,
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Match the pairs
      </p>

      <div style={{ display: 'flex', gap: spacing.lg, width: '100%', maxWidth: 400 }}>
        {/* Left column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {pairs.map((pair, i) => leftCard(pair.left, i))}
        </div>
        {/* Right column — shuffled */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          {pairs.map((_, displayIdx) => rightCard(displayIdx))}
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {wrong && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ fontFamily: fonts.sans, fontSize: 13, color: p.textSoft, opacity: 0.7 }}
          >
            Not quite… try again
          </motion.p>
        )}
      </AnimatePresence>

      <p style={{ fontFamily: fonts.sans, fontSize: 12, color: p.textSoft, opacity: 0.4 }}>
        {matched.size} / {pairs.length}
      </p>
    </div>
  );
}
