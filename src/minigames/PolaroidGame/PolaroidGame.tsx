// ─── Polaroid Game ────────────────────────────────────────────────────────────
// Click repeatedly to "develop" each Polaroid — grayscale fades to color.

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, radius, shadow, spacing } from '../../theme';

interface ImagePair { caption?: string; label: string }
interface Props { imagePairs: ImagePair[]; onComplete: () => void }

const TAPS_TO_DEVELOP = 8;

export default function PolaroidGame({ imagePairs, onComplete }: Props) {
  const { palette: p } = useEmotion();
  const [idx, setIdx]     = useState(0);
  const [taps, setTaps]   = useState(0);
  const [shaking, setShaking] = useState(false);

  const progress = taps / TAPS_TO_DEVELOP;
  const developed = progress >= 1;

  const handleTap = useCallback(() => {
    if (developed) {
      if (idx >= imagePairs.length - 1) {
        setTimeout(onComplete, 400);
      } else {
        setIdx(i => i + 1);
        setTaps(0);
      }
      return;
    }
    setTaps(t => Math.min(t + 1, TAPS_TO_DEVELOP));
    setShaking(true);
    setTimeout(() => setShaking(false), 200);
  }, [developed, idx, imagePairs.length, onComplete]);

  const photo = imagePairs[idx];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
      <p style={{ fontFamily: fonts.sans, fontSize: 14, fontWeight: 300, color: p.textSoft, textAlign: 'center' }}>
        {developed ? 'Tap to continue' : 'Keep tapping to develop'}
      </p>

      {/* Polaroid */}
      <motion.div
        onClick={handleTap}
        animate={shaking ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          background: '#FAFAFA',
          border: '1px solid #E8E8E8',
          borderRadius: radius.sm,
          padding: spacing.sm,
          boxShadow: shadow.lift,
          cursor: 'pointer',
          width: 200,
        }}
      >
        {/* Photo area */}
        <div style={{
          width: '100%',
          height: 170,
          borderRadius: radius.sm,
          overflow: 'hidden',
          position: 'relative',
          background: p.panelBorder,
        }}>
          {/* Gray base */}
          <div style={{ position: 'absolute', inset: 0, background: p.panelBorder }} />
          {/* Color reveal */}
          <motion.div
            animate={{ opacity: progress }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${p.accentSoft} 0%, ${p.accent}55 100%)`,
            }}
          />
          {/* Label */}
          <AnimatePresence>
            {developed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fonts.handwritten,
                  fontSize: 14,
                  fontStyle: 'italic',
                  color: p.text,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                  padding: spacing.sm,
                }}
              >
                {photo.label}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Caption strip */}
        <div style={{ paddingTop: spacing.sm, paddingBottom: spacing.xs, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence>
            {developed && photo.caption && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontFamily: fonts.handwritten, fontSize: 13, fontStyle: 'italic', color: p.text, textAlign: 'center', textTransform: 'capitalize' }}
              >
                {photo.caption}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 4, background: p.accentSoft, borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.2 }}
          style={{ height: '100%', background: p.accent, borderRadius: 2 }}
        />
      </div>

      {/* Photo counter dots */}
      <div style={{ display: 'flex', gap: spacing.xs }}>
        {imagePairs.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i < idx ? p.accent : i === idx ? (developed ? p.accent : p.accentSoft) : p.panelBorder,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}
