// ─── Panel Layout ─────────────────────────────────────────────────────────────
// Renders revealed panels in a scrollable vertical strip.
// New panels animate from the centre of the screen and slide upward.

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelScene } from '../../types/story';
import ComicPanel from '../ComicPanel/ComicPanel';
import { useStory } from '../../systems/StoryEngine';
import { spacing } from '../../theme';

const MAX_WIDTH = 520;
const PANEL_GAP = 28;

interface Props {
  scene: PanelScene;
  containerWidth: number;
  containerHeight: number;
}

export default function PanelLayout({ scene, containerWidth, containerHeight }: Props) {
  const { panelIndex, advancePanel } = useStory();
  const scrollRef = useRef<HTMLDivElement>(null);

  const panelWidth = Math.min(containerWidth - spacing.xl * 2, MAX_WIDTH);

  // Scroll to bottom when new panel appears
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Delay so the panel has time to mount and the animation starts
    setTimeout(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 150);
  }, [panelIndex]);

  // Height by layout type
  const panelHeight = (layout: PanelScene['panels'][number]['layout']) => {
    switch (layout) {
      case 'full':            return Math.min(containerHeight * 0.58, 360);
      case 'half_h':          return Math.min(containerHeight * 0.34, 220);
      case 'featured_top':    return Math.min(containerHeight * 0.5, 310);
      case 'featured_bottom': return Math.min(containerHeight * 0.32, 200);
      default:                return Math.min(containerHeight * 0.4, 260);
    }
  };

  const visiblePanels = scene.panels.slice(0, panelIndex + 1);

  return (
    <div
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: PANEL_GAP,
        // Extra top padding so first panel starts from vertical center
        padding: `${Math.max(spacing.xxl, containerHeight * 0.18)}px ${spacing.xl}px ${spacing.xxl * 1.5}px`,
        scrollbarWidth: 'none',
      }}
    >
      <style>{`div::-webkit-scrollbar{display:none}`}</style>

      <AnimatePresence>
        {visiblePanels.map((panel, idx) => (
          <motion.div
            key={panel.id}
            initial={idx === panelIndex ? { opacity: 0, y: '28vh' } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.05,
            }}
          >
            <ComicPanel
              panel={panel}
              width={panelWidth}
              height={panelHeight(panel.layout)}
              onTap={idx === panelIndex ? advancePanel : () => {}}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
