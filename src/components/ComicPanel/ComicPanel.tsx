// ─── Comic Panel ──────────────────────────────────────────────────────────────
// Single comic panel with thin dark ink border on sketchbook-white background.
// Fades in from slightly below on reveal — matches Florence's gentle panel entrances.

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '../../types/story';
import CharacterSprite from '../Character/CharacterSprite';
import EnvironmentIllustration from '../Character/EnvironmentIllustration';
import SpeechBubble from '../SpeechBubble/SpeechBubble';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, spacing } from '../../theme';

interface Props {
  panel: Panel;
  width: number;
  height: number;
  onTap: () => void;
  delay?: number;
}

export default function ComicPanel({ panel, width, height, onTap, delay = 0 }: Props) {
  const { palette: p } = useEmotion();
  const ref = useRef<HTMLDivElement>(null);
  const charSize = Math.min(width * 0.38, 88);

  const panelRadius = 6; // Florence uses small corner rounding — not large

  return (
    <motion.div
      ref={ref}
      onClick={onTap}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width,
        height,
        background: p.panelBg,
        borderRadius: panelRadius,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Narration — top of panel, italic serif */}
      {panel.content[0]?.narration && (
        <p style={{
          textAlign: 'center',
          fontFamily: fonts.handwritten,
          fontSize: 14,
          fontStyle: 'italic',
          lineHeight: 1.55,
          color: p.text,
          textTransform: 'capitalize',
          padding: `${spacing.sm}px ${spacing.md}px ${spacing.xs}px`,
          flexShrink: 0,
          borderBottom: panel.content.some(c => c.type === 'character' || c.type === 'environment')
            ? `1px solid ${p.panelBorder}22`
            : 'none',
        }}>
          {panel.content[0].narration}
        </p>
      )}

      {/* Content area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        padding: `0 ${spacing.sm}px ${spacing.md}px`,
        gap: spacing.xs,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Environment — fills behind everything */}
        {panel.content.filter(c => c.type === 'environment').map(c => (
          <div key={c.id} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {c.overlayText ? (
              <>
                <div style={{ zIndex: 10, paddingTop: spacing.md, flexShrink: 0 }}>
                  <SpeechBubble text={c.overlayText} tail="bottom-center" delay={0.2} />
                </div>
                <div style={{ flex: 1, width: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EnvironmentIllustration
                    assetKey={c.backgroundAsset ?? 'abstract_memory'}
                    width={width}
                    height={height}
                  />
                </div>
              </>
            ) : (
              <div style={{ position: 'absolute', inset: 0 }}>
                <EnvironmentIllustration
                  assetKey={c.backgroundAsset ?? 'abstract_memory'}
                  width={width}
                  height={height}
                />
              </div>
            )}
          </div>
        ))}

        {/* Characters + speech bubbles */}
        {panel.content.filter(c => c.type === 'character').map((c, idx) => (
          <div key={c.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            zIndex: 2,
            position: 'relative',
          }}>
            {c.overlayText && (
              <SpeechBubble
                text={c.overlayText}
                tail={idx === 0 ? 'bottom-left' : 'bottom-right'}
                delay={0.22 + idx * 0.1}
              />
            )}
            <CharacterSprite
              characterId={c.character ?? 'protagonist'}
              expression={c.expression ?? 'neutral'}
              size={charSize}
              flip={idx > 0}
            />
          </div>
        ))}

        {/* Abstract / caption panels */}
        {panel.content.filter(c => c.type === 'abstract').map(c => (
          <div key={c.id} style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.lg,
            background: p.accentSoft,
            margin: spacing.sm,
            zIndex: 1,
          }}>
            {c.overlayText && (
              <p style={{
                fontFamily: fonts.handwritten,
                fontSize: 16,
                fontStyle: 'italic',
                lineHeight: 1.6,
                color: p.text,
                textAlign: 'center',
                textTransform: 'capitalize',
              }}>
                {c.overlayText}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tap-to-continue hint */}
      {panel.tapToContinue && (
        <p  
          style={{
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontSize: 10,
          letterSpacing: '0.08em',
          opacity: 0.65,
          flexShrink: 0,
          color: p.text,
          paddingTop: spacing.xs,
          paddingBottom: spacing.xs,
        }}>
          Tap to Continue
        </p>
      )}
    </motion.div>
  );
}
