// ─── Title Screen ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Story } from '../../types/story';
import { useStory } from '../../systems/StoryEngine';
import bgImg from '../../assets/home-screen/background.png';

const IS_DEV = import.meta.env.DEV;

interface Props { story: Story; onStart: () => void }

export default function TitleScreen({ story, onStart }: Props) {
  const { jumpToChapter, jumpToScene } = useStory();
  const [devOpen, setDevOpen] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  function handleChapterJump(chapterId: string) {
    jumpToChapter(chapterId);
    onStart();
  }

  function handleSceneJump(chapterId: string, sceneId: string) {
    jumpToScene(chapterId, sceneId);
    onStart();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-full flex flex-col items-center cursor-pointer overflow-hidden"
    >
      {/* Background illustration */}
      <img
        src={bgImg}
        alt=""
        draggable={false}
        onClick={onStart}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
      />

      {/* Vignette — fades all edges to dark */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #1a1a2e 100%)' }}
      />

      {/* Bottom glow — darkens area behind text */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[60%] pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center bottom, rgba(0,0,0,0.8) 0%, transparent 65%)' }}
      />

      {/* Spacer — pushes text block to the bottom */}
      <div className="flex-1" onClick={onStart} />

      {/* Text block */}
      <div className="relative z-20 flex flex-col items-center gap-3" style={{paddingBottom:"100px"}} onClick={onStart}>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[clamp(36px,9vw,52px)] tracking-[0.06em] text-white text-center capitalize m-0 leading-none"
          style={{ fontFamily: "'Barrio', cursive", textShadow: '0 3px 24px rgba(0,0,0,0.7)' }}
        >
          Between Pages
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="text-lg italic text-white/95 tracking-[0.08em] m-0 capitalize"
          style={{ fontFamily: "'Bellefair', serif", textShadow: '0 2px 14px rgba(0,0,0,0.65)', paddingBottom: '30px' }}
        >
          - a story in chapters -
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{ delay: 1.8, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-sm text-white/90 tracking-[0.16em] m-0 mt-2 uppercase"
          style={{ fontFamily: "'Bellefair', serif", textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
        >
          Tap anywhere to begin
        </motion.p>

      </div>

      {/* ── DEV MODE: Chapter selector ───────────────────────────────────────── */}
      {IS_DEV && (
        <div
          style={{
            position: 'absolute', bottom: 16, right: 16,
            zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setDevOpen(o => !o)}
            style={{
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8,
              color: '#FFD580', fontFamily: 'monospace', fontSize: 11,
              padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.1em',
            }}
          >
            ⚙ DEV
          </button>

          <AnimatePresence>
            {devOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                style={{
                  background: 'rgba(10,10,18,0.85)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
                  padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180,
                }}
              >
                <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.15em', marginBottom: 2 }}>
                  JUMP TO CHAPTER
                </div>
                {story.chapters.map((ch, idx) => (
                  <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Chapter header row */}
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => handleChapterJump(ch.id)}
                        title="Jump to start of chapter"
                        style={{
                          flex: 1,
                          background: expandedChapter === ch.id ? 'rgba(255,213,128,0.15)' : 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 6, color: '#fff', fontFamily: 'monospace',
                          fontSize: 12, padding: '5px 10px', cursor: 'pointer',
                          textAlign: 'left', letterSpacing: '0.05em',
                        }}
                      >
                        Ch {idx + 1} — {ch.title}
                      </button>
                      <button
                        onClick={() => setExpandedChapter(expandedChapter === ch.id ? null : ch.id)}
                        title="Expand scenes"
                        style={{
                          background: 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 6, color: '#FFD580', fontFamily: 'monospace',
                          fontSize: 12, padding: '5px 8px', cursor: 'pointer',
                        }}
                      >
                        {expandedChapter === ch.id ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* Scene list — only when this chapter is expanded */}
                    <AnimatePresence>
                      {expandedChapter === ch.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 10 }}
                        >
                          {ch.scenes.map((sc, sIdx) => (
                            <button
                              key={sc.id}
                              onClick={() => handleSceneJump(ch.id, sc.id)}
                              style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 5, color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace',
                                fontSize: 11, padding: '4px 8px', cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              ↳ S{sIdx + 1} · <span style={{ color: '#a8d8a8' }}>{sc.type}</span> · <span style={{ opacity: 0.5 }}>{sc.id}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {/* ── END DEV MODE ─────────────────────────────────────────────────────── */}

    </motion.div>
  );
}
