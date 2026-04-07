// ─── Speech Bubble ────────────────────────────────────────────────────────────
// Corners are ROUND during positive moments, SHARP during conflict.
// This directly mirrors Florence's design — contour bias at work.

import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, spacing } from '../../theme';

type Tail = 'none' | 'bottom-left' | 'bottom-right' | 'bottom-center';

interface Props {
  text: string;
  tail?: Tail;
  delay?: number;
  style?: CSSProperties;
}

export default function SpeechBubble({
  text,
  tail = 'bottom-left',
  delay = 0,
  style,
}: Props) {
  const { palette: p } = useEmotion();
  const br = p.bubbleRadius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        display: 'inline-block',
        background: p.bubbleBg,
        border: `1.5px solid ${p.bubbleBorder}`,
        borderRadius: br,
        padding: `${spacing.md}px ${spacing.md}px`,
        maxWidth: 210,
        fontFamily: fonts.serif,
        fontSize: 11,
        lineHeight: 1.6,
        color: p.text,
        textTransform: 'none',
        boxShadow: '1px 1px 0 rgba(0,0,0,0.06)',
        ...style,
      }}
    >
      {text}

      {/* Tail — the small corner spike pointing to speaker */}
      {tail !== 'none' && (
        <span
          style={{
            position: 'absolute',
            bottom: -9,
            ...(tail === 'bottom-left' ? { left: 16 } : {}),
            ...(tail === 'bottom-right' ? { right: 16 } : {}),
            ...(tail === 'bottom-center' ? { left: '50%', marginLeft: -7 } : {}),
            width: 14,
            height: 14,
            background: p.bubbleBg,
            border: `1.5px solid ${p.bubbleBorder}`,
            borderTop: 'none',
            borderRight: tail === 'bottom-left' ? 'none' : undefined,
            borderLeft:  (tail === 'bottom-right' || tail === 'bottom-center') ? 'none' : undefined,
            transform: 'rotate(45deg)',
            display: 'block',
          }}
        />
      )}
    </motion.div>
  );
}
