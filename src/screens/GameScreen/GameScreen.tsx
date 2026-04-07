// ─── Game Screen ──────────────────────────────────────────────────────────────
// Main gameplay surface. Wraps content in EmotionProvider so all components
// react to the current palette. Animates background color changes smoothly.

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '../../systems/StoryEngine';
import { EmotionProvider } from '../../systems/EmotionContext';
import { getPalette } from '../../theme/colors';
import PanelLayout from '../../components/PanelLayout/PanelLayout';
import MiniGameHost from '../../components/MiniGameHost/MiniGameHost';
import { PanelScene, MiniGameScene } from '../../types/story';
import { fonts, spacing } from '../../theme';

interface Props { onExit?: () => void }

export default function GameScreen({ onExit }: Props) {
  const { emotion, chapter, scene, isDone } = useStory();
  const containerRef = useRef<HTMLDivElement>(null);
  const palette = getPalette(emotion);

  if (isDone || !chapter || !scene) {
    return (
      <EmotionProvider emotion={emotion}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ width: '100%', height: '100%', background: palette.pageBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14 }}
            style={{ fontSize: 48 }}
          >
            ♥
          </motion.div>
          <p style={{ fontFamily: fonts.handwritten, fontSize: 30, color: palette.text, textAlign: 'center', textTransform: 'capitalize' }}>
            The End
          </p>
          <p style={{ fontFamily: fonts.handwritten, fontStyle: 'italic', fontSize: 16, color: palette.text, textAlign: 'center', textTransform: 'capitalize' }}>
            Every story has its own colour.
          </p>
          {onExit && (
            <button
              onClick={onExit}
              style={{
                marginTop: spacing.lg,
                background: 'none',
                border: `1px solid ${palette.panelBorder}`,
                borderRadius: 999,
                padding: `${spacing.sm}px ${spacing.xl}px`,
                fontFamily: fonts.sans,
                fontSize: 12,
                letterSpacing: '0.1em',
                color: palette.textSoft,
                cursor: 'pointer',
              }}
            >
              BACK TO MENU
            </button>
          )}
        </motion.div>
      </EmotionProvider>
    );
  }

  return (
    <EmotionProvider emotion={emotion}>
      <motion.div
        ref={containerRef}
        initial={{ background: palette.pageBg }}
        animate={{ background: palette.pageBg }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      >
        {/* Header — borderless, generous padding */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${spacing.lg}px ${spacing.xl}px ${spacing.md}px`,
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: fonts.sans, fontSize: 12, letterSpacing: '0.2em', color: palette.textSoft, opacity: 0.6 }}>
            {chapter.title.toUpperCase()}
          </span>
          {onExit && (
            <button
              onClick={onExit}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: palette.textSoft, opacity: 0.5, padding: 4 }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Subtitle */}
        {chapter.subtitle && (
          <p style={{
            fontFamily: fonts.handwritten,
            fontStyle: 'italic',
            fontSize: 15,
            color: palette.text,
            textAlign: 'center',
            padding: `${spacing.md}px ${spacing.xl}px ${spacing.xs}px`,
            flexShrink: 0,
            textTransform: 'capitalize',
          }}>
            {chapter.subtitle}
          </p>
        )}

        {/* Scene content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ flex: 1, display: 'flex', overflow: 'hidden' }}
          >
            {scene.type === 'panel_sequence' ? (
              <PanelLayout
                scene={scene as PanelScene}
                containerWidth={containerRef.current?.offsetWidth ?? 400}
                containerHeight={containerRef.current?.offsetHeight ?? 700}
              />
            ) : (
              <MiniGameHost scene={scene as MiniGameScene} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </EmotionProvider>
  );
}
