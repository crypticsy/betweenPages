import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, shadow, spacing } from '../../theme';

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

  // Split progress into two phases: black-to-gray (0-0.4) and gray-to-color (0.4-1.0)
  const grayOpacity = Math.min(progress / 0.4, 1);
  const colorOpacity = progress > 0.4 ? Math.min((progress - 0.4) / 0.6, 1) : 0;

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
        animate={shaking ? { 
          x: [0, -4, 4, -3, 3, 0], 
          y: [0, 2, -2, 1, -1, 0],
          rotate: [0, -1, 1, -0.5, 0.5, 0] 
        } : { x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 0.25 }}
        whileHover={{ scale: developed ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: '#F9F7F2', // Slightly aged paper color
          padding: '12px 12px 48px',
          boxShadow: developed ? '0 15px 45px rgba(0,0,0,0.2)' : '0 8px 24px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          width: 270,
          position: 'relative',
          border: '1px solid #E6E1D8',
        }}
      >
        {/* Photo area */}
        <div style={{
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          position: 'relative',
          background: '#0a0a0a', // Start from black
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
        }}>
          {imageUrl ? (
            <>
              {/* Grayscale layer */}
              <motion.img
                src={imageUrl}
                alt={photo.label}
                animate={{ opacity: grayOpacity }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(1) brightness(0.9) contrast(1.1)',
                }}
              />
              {/* Color reveal layer */}
              <motion.img
                src={imageUrl}
                alt={photo.label}
                animate={{ opacity: colorOpacity }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              
              {/* Development Vignette / Blur */}
              {!developed && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle, transparent 20%, rgba(0,0,0,${0.5 * (1 - progress)}) 100%)`,
                  pointerEvents: 'none',
                }} />
              )}
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#111' }} />
          )}

          {/* Developing grain overlay */}
          <motion.div
            animate={{ opacity: developed ? 0 : [0.15, 0.25, 0.15] }}
            transition={{ duration: 0.8, repeat: developed ? 0 : Infinity }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'url("https://grainy-gradients.vercel.app/noise.svg")',
              mixBlendMode: 'overlay',
            }}
          />
        </div>

        {/* Caption (Handwritten) */}
        <div style={{ 
          position: 'absolute', 
          bottom: 14, 
          left: 0, 
          right: 0, 
          textAlign: 'center', 
          padding: '0 18px' 
        }}>
          <AnimatePresence>
            {developed && (
              <motion.p
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                style={{ 
                  fontFamily: fonts.handwritten, 
                  fontSize: 18, 
                  color: '#3d342d', 
                  margin: 0,
                  transform: 'rotate(-1deg)'
                }}
              >
                {photo.label}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md }}>
        {imagePairs.map((_, i) => (
          <motion.div 
            key={i} 
            animate={{
              background: i < idx ? p.accent : i === idx ? (developed ? p.accent : p.accentSoft) : '#D3CEC4',
              scale: i === idx ? 1.2 : 1,
            }}
            style={{
              width: 8, height: 8, borderRadius: '50%',
            }} 
          />
        ))}
      </div>
    </div>
  );
}
