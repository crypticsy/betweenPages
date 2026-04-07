// ─── Polaroid Game ────────────────────────────────────────────────────────────
// Click repeatedly to "develop" each Polaroid — grayscale fades to color.

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, radius, shadow, spacing } from '../../theme';

interface ImagePair { caption?: string; label: string; assetKey?: string }
interface Props { imagePairs: ImagePair[]; onComplete: () => void }

const TAPS_TO_DEVELOP = 12;

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
  
  // Use relative path for dynamic loading from assets
  const imageUrl = photo.assetKey 
    ? new URL(`../../assets/chapters/${photo.assetKey}.png`, import.meta.url).href
    : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
      <p style={{ fontFamily: fonts.sans, fontSize: 13, letterSpacing: '0.12em', color: p.textSoft, textAlign: 'center', textTransform: 'uppercase' }}>
        {developed ? 'Click to continue' : 'Tap to develop the memory'}
      </p>

      {/* Polaroid Container */}
      <motion.div
        onClick={handleTap}
        animate={shaking ? { x: [0, -5, 5, -3, 3, 0], scale: [1, 1.02, 1] } : { x: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: developed ? 1.05 : 1 }}
        style={{
          background: '#FFFFFF',
          padding: '12px 12px 42px',
          boxShadow: developed ? '0 12px 40px rgba(0,0,0,0.15)' : shadow.lift,
          cursor: 'pointer',
          width: 260,
          position: 'relative',
        }}
      >
        {/* Photo area */}
        <div style={{
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          position: 'relative',
          background: '#EBEEF0',
        }}>
          {imageUrl ? (
            <>
              {/* Grayscale base layer */}
              <img
                src={imageUrl}
                alt={photo.label}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(1) brightness(0.8) contrast(1.1)',
                  opacity: 0.85,
                }}
              />
              {/* Color reveal layer */}
              <motion.img
                src={imageUrl}
                alt={photo.label}
                animate={{ opacity: progress }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)'
                }}
              />
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: p.panelBorder }} />
          )}

          {/* Developing grain overlay */}
          {!developed && (
             <motion.div
               animate={{ opacity: [0.3, 0.4, 0.3] }}
               transition={{ duration: 0.5, repeat: Infinity }}
               style={{
                 position: 'absolute', inset: 0, pointerEvents: 'none',
                 background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
                 opacity: progress > 0 ? (1 - progress) * 0.5 : 0.5,
               }}
             />
          )}
        </div>

        {/* Caption */}
        <div style={{ 
          position: 'absolute', 
          bottom: 12, 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          padding: '0 12px' 
        }}>
          <AnimatePresence>
            {developed && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  fontFamily: fonts.handwritten, 
                  fontSize: 16, 
                  color: p.text, 
                  margin: 0,
                  textTransform: 'capitalize' 
                }}
              >
                {photo.label}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress guide dots */}
      <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.lg }}>
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
