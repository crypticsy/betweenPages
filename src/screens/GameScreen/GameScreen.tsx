// ─── Game Screen ──────────────────────────────────────────────────────────────
// Main gameplay surface. Wraps content in EmotionProvider so all components
// react to the current palette. Animates background color changes smoothly.

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '../../systems/StoryEngine';
import { EmotionProvider } from '../../systems/EmotionContext';
import { getPalette } from '../../theme/colors';
import PanelLayout from '../../components/PanelLayout/PanelLayout';
import MiniGameHost from '../../components/MiniGameHost/MiniGameHost';
import BurnTransition from '../../components/BurnTransition/BurnTransition';
import { PanelScene, MiniGameScene } from '../../types/story';
import { fonts, spacing } from '../../theme';

const IS_DEV = import.meta.env.DEV;

interface Props { onExit?: () => void }

export default function GameScreen({ onExit }: Props) {
  const {
    emotion, chapter, scene, isDone, isChapterComplete,
    story, advanceChapter, completedChapters, completedScenes,
    jumpToChapter, jumpToScene,
  } = useStory();
  const containerRef = useRef<HTMLDivElement>(null);
  const palette = getPalette(emotion);
  const [burning, setBurning] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [transitionProps, setTransitionProps] = useState<{
    burnColor: string;
    fireInner: string;
    fireOuter: string;
  } | null>(null);

  // Stable refs so the effect never re-fires due to palette/chapter identity changes
  const chapterRef = useRef(chapter);
  const storyRef   = useRef(story);
  chapterRef.current = chapter;
  storyRef.current   = story;

  // Trigger chapter transition — only depend on the boolean flag changes
  useEffect(() => {
    if (!isChapterComplete) return;
    if (burning) return; // already running

    const ch       = chapterRef.current;
    const chapters = storyRef.current.chapters;

    if (ch) {
      const nextIdx = chapters.findIndex(c => c.id === ch.id) + 1;
      const nextCh  = chapters[nextIdx];
      if (nextCh) {
        const nextPal = getPalette(nextCh.emotion);
        // Fire colors are both from the NEXT chapter so the flame matches where we're going
        setTransitionProps({
          burnColor: nextPal.pageBg,
          fireInner: nextPal.accentMid,
          fireOuter: nextPal.accentSoft,
        });
      }
    }
    setBurning(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChapterComplete]); // intentionally stable — all mutable values read via refs

  if (isDone || !chapter || !scene) {
    return (
      <EmotionProvider emotion={emotion}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            width: '100%', height: '100%',
            background: palette.pageBg,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', position: 'relative',
          }}
        >
          {/* Decorative soft radial glow */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 50% 40%, ${palette.accentSoft}88 0%, transparent 70%)`,
          }} />

          {/* Heart + title */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            style={{ fontSize: 52, marginBottom: spacing.sm, position: 'relative', zIndex: 1 }}
          >
            ♥
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{ fontFamily: fonts.handwritten, fontSize: 34, color: palette.text, textAlign: 'center', margin: 0, position: 'relative', zIndex: 1 }}
          >
            The End
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{ fontFamily: fonts.handwritten, fontStyle: 'italic', fontSize: 15, color: palette.textSoft, textAlign: 'center', margin: `${spacing.xs}px 0 0`, position: 'relative', zIndex: 1 }}
          >
            Thanks for playing!
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{ width: 60, height: 1, background: palette.accentMid, margin: `${spacing.xxl}px 0`, position: 'relative', zIndex: 1 }}
          />

          {/* === CREDITS SECTION — edit names/links here === */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480, padding: `0 ${spacing.xl}px` }}
          >
            {/* Credit rows — role left, name middle, image right */}
            {[
              {
                role: 'Developer',
                delay: 1.7,
                name: (
                  <a href="https://animeshbasnet.com.np" target="_blank" rel="noreferrer"
                    style={{ color: palette.text, textDecoration: 'none', borderBottom: `1px solid ${palette.accentMid}`, paddingBottom: 1 }}>
                    crypticsy {/* ← your name/handle */}
                  </a>
                ),
                image: (
                  <img
                    src="https://avatars.githubusercontent.com/crypticsy"
                    alt="Developer"
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      border: `1.5px solid ${palette.accentMid}`,
                      boxShadow: `0 2px 10px ${palette.accentSoft}`,
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                )
              },
              {
                role: 'Screenplay',
                delay: 1.95,
                name: <span>ChatGPT {/* ← screenplay credit */}</span>,
              },
              {
                role: 'Music',
                delay: 2.2,
                name: (
                  <a href="https://pixabay.com/music/modern-classical-240508-piano-retro-fairytail-239358/"
                    target="_blank" rel="noreferrer"
                    style={{ color: palette.text, textDecoration: 'none', borderBottom: `1px solid ${palette.accentMid}`, paddingBottom: 1, lineHeight: 1.5 }}>
                    240508 – Piano / Retro / FairyTail {/* ← music title */}
                    <br /><span style={{ fontSize: 11, color: palette.textSoft }}>WELC0MEИ0</span>
                  </a>
                ),
              },
            ].map(({ role, name, image, delay }) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay, duration: 0.5 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(80px, auto) 1fr 40px',
                  alignItems: 'start',
                  padding: `${spacing.sm}px 0`,
                  borderBottom: `1px solid ${palette.accentSoft}`,
                  gap: spacing.lg,
                }}
              >
                {/* Left — role title */}
                <span style={{
                  fontFamily: fonts.sans,
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: palette.textSoft,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  paddingTop: 4,
                }}>
                  {role}
                </span>
                {/* Middle — name / link */}
                <span style={{
                  fontFamily: fonts.handwritten,
                  fontSize: 16,
                  color: palette.text,
                  textAlign: 'right',
                  paddingTop: 2,
                }}>
                  {name}
                </span>
                {/* Right — optional image */}
                <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end', paddingTop: 0 }}>
                  {image}
                </div>
              </motion.div>
            ))}
          </motion.div>
          {/* === END CREDITS === */}

          {onExit && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.5 }}
              onClick={onExit}
              style={{
                marginTop: spacing.xxl * 1.5,
                background: 'none',
                border: `1px solid ${palette.panelBorder}`,
                borderRadius: 999,
                padding: `${spacing.sm}px ${spacing.xl}px`,
                fontFamily: fonts.sans,
                fontSize: 11,
                letterSpacing: '0.16em',
                color: palette.textSoft,
                cursor: 'pointer',
                position: 'relative', zIndex: 1,
              }}
            >
              BACK TO MENU
            </motion.button>
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
        transition={{ duration: burning ? 0 : 0.7, ease: 'easeInOut' }}
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
            transition={{ duration: burning ? 0 : 0.35 }}
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

        {/* Inter-chapter Burn Transition */}
        {transitionProps && (
           <BurnTransition
             active={burning}
             burnColor={transitionProps.burnColor}
             fireInner={transitionProps.fireInner}
             fireOuter={transitionProps.fireOuter}
             onMidpoint={() => advanceChapter()}
             onComplete={() => {
               setBurning(false);
               setTransitionProps(null);
             }}
           />
        )}

        {/* ── Floating chapter/scene navigator ────────────────────────────── */}
        <div
          style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => { setNavOpen(o => !o); setExpandedChapter(null); }}
            title="Navigate story"
            style={{
              background: `${palette.panelBg}cc`,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${palette.accentSoft}`,
              borderRadius: 8,
              color: IS_DEV ? '#FFD580' : palette.accentMid,
              fontFamily: 'monospace',
              fontSize: 11,
              padding: '4px 10px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              boxShadow: `0 2px 12px ${palette.panelShadow}`,
            }}
          >
            {IS_DEV ? '⚙ DEV' : '☰'}
          </button>

          <AnimatePresence>
            {navOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                style={{
                  background: `${palette.panelBg}f0`,
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${palette.accentSoft}`,
                  borderRadius: 10,
                  padding: '10px 12px',
                  display: 'flex', flexDirection: 'column', gap: 5,
                  minWidth: 200,
                  boxShadow: `0 4px 24px ${palette.panelShadow}`,
                }}
              >
                <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.15em', color: palette.textSoft, marginBottom: 2 }}>
                  {IS_DEV ? 'JUMP TO' : 'STORY MAP'}
                </div>

                {story.chapters.map((ch, idx) => {
                  // A chapter is accessible if DEV, or it's been started/completed
                  const chReached = IS_DEV
                    || completedChapters.includes(ch.id)
                    || chapter?.id === ch.id;

                  return (
                    <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          disabled={!chReached}
                          onClick={() => { if (chReached) { jumpToChapter(ch.id); setNavOpen(false); } }}
                          style={{
                            flex: 1,
                            background: chapter?.id === ch.id
                              ? `${palette.accentSoft}`
                              : chReached ? `${palette.panelBg}` : 'transparent',
                            border: `1px solid ${chReached ? palette.accentMid : palette.accentSoft}`,
                            borderRadius: 6,
                            color: chReached ? palette.text : palette.textSoft,
                            fontFamily: fonts.sans,
                            fontSize: 11, padding: '5px 8px',
                            cursor: chReached ? 'pointer' : 'default',
                            textAlign: 'left', letterSpacing: '0.04em',
                            opacity: chReached ? 1 : 0.4,
                          }}
                        >
                          {!chReached && '🔒 '}{chReached && chapter?.id === ch.id && '▶ '}Ch {idx + 1} — {ch.title}
                        </button>
                        {IS_DEV && (
                          <button
                            onClick={() => setExpandedChapter(expandedChapter === ch.id ? null : ch.id)}
                            style={{
                              background: palette.panelBg,
                              border: `1px solid ${palette.accentSoft}`,
                              borderRadius: 6,
                              color: palette.accentMid, fontFamily: 'monospace',
                              fontSize: 11, padding: '4px 7px', cursor: 'pointer',
                            }}
                          >
                            {expandedChapter === ch.id ? '▲' : '▼'}
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {IS_DEV && expandedChapter === ch.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 10 }}
                          >
                            {ch.scenes.map((sc, sIdx) => {
                              const scReached = IS_DEV
                                || completedScenes.includes(sc.id)
                                || (chapter?.id === ch.id && scene?.id === sc.id);

                              return (
                                <button
                                  key={sc.id}
                                  disabled={!scReached}
                                  onClick={() => { if (scReached) { jumpToScene(ch.id, sc.id); setNavOpen(false); } }}
                                  style={{
                                    background: scene?.id === sc.id ? `${palette.accentSoft}88` : 'transparent',
                                    border: `1px solid ${scReached ? palette.accentSoft : 'transparent'}`,
                                    borderRadius: 5,
                                    color: scReached ? palette.text : palette.textSoft,
                                    fontFamily: 'monospace', fontSize: 10,
                                    padding: '3px 8px', cursor: scReached ? 'pointer' : 'default',
                                    textAlign: 'left', opacity: scReached ? 1 : 0.35,
                                  }}
                                >
                                  {!scReached && '🔒'}
                                  {scReached && scene?.id === sc.id && '▶ '}
                                  {scReached && scene?.id !== sc.id && '↳ '}
                                  S{sIdx + 1} · <span style={{ color: palette.accentMid }}>{sc.type}</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* ── End floating navigator ───────────────────────────────────────── */}

      </motion.div>
    </EmotionProvider>
  );
}
