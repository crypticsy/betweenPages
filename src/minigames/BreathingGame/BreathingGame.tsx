// ─── Breathing Game ────────────────────────────────────────────────���──────────
// Soft pulsing circle. Runs automatically through inhale → hold → exhale cycles.

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, spacing } from '../../theme';

type Phase = 'inhale' | 'hold' | 'exhale' | 'done';

const INHALE_MS = 2800;
const HOLD_MS   = 900;
const EXHALE_MS = 2800;

interface Props {
  cycles?: number;
  onComplete: () => void;
}

export default function BreathingGame({ cycles = 3, onComplete }: Props) {
  const { palette: p } = useEmotion();
  const [phase, setPhase] = useState<Phase>('inhale');
  const [cycle, setCycle] = useState(0);
  const [label, setLabel] = useState('Breathe in…');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cycleCount = 0;

    function runCycle() {
      setPhase('inhale');
      setLabel('Breathe in…');

      timerRef.current = setTimeout(() => {
        setPhase('hold');
        setLabel('Hold…');

        timerRef.current = setTimeout(() => {
          setPhase('exhale');
          setLabel('Breathe out…');

          timerRef.current = setTimeout(() => {
            cycleCount++;
            setCycle(cycleCount);
            if (cycleCount >= cycles) {
              setPhase('done');
              setLabel('');
              setTimeout(onComplete, 600);
            } else {
              runCycle();
            }
          }, EXHALE_MS);
        }, HOLD_MS);
      }, INHALE_MS);
    }

    const delay = setTimeout(runCycle, 600);
    return () => {
      clearTimeout(delay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circleSize = 200;

  const variants = {
    inhale:  { scale: 1,    opacity: 0.85 },
    hold:    { scale: 1,    opacity: 0.85 },
    exhale:  { scale: 0.5,  opacity: 0.45 },
    done:    { scale: 0.5,  opacity: 0.3  },
  };

  const durations: Record<Phase, number> = {
    inhale: INHALE_MS / 1000,
    hold:   HOLD_MS   / 1000,
    exhale: EXHALE_MS / 1000,
    done:   0.4,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: spacing.xl }}>
      {/* Circle */}
      <div style={{ position: 'relative', width: circleSize, height: circleSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer ring */}
        <motion.div
          animate={phase}
          variants={{
            inhale: { scale: 1.18, opacity: 0.2 },
            hold:   { scale: 1.18, opacity: 0.2 },
            exhale: { scale: 0.65, opacity: 0.1 },
            done:   { scale: 0.65, opacity: 0 },
          }}
          transition={{ duration: durations[phase], ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: circleSize,
            height: circleSize,
            borderRadius: '50%',
            border: `2px solid ${p.accent}`,
          }}
        />
        {/* Main circle */}
        <motion.div
          animate={phase}
          variants={variants}
          initial={{ scale: 0.5, opacity: 0.45 }}
          transition={{ duration: durations[phase], ease: 'easeInOut' }}
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: '50%',
            background: p.accent,
          }}
        />
      </div>

      {/* Label */}
      <p style={{ fontFamily: fonts.sans, fontSize: 15, fontWeight: 300, color: p.textSoft, textAlign: 'center', minHeight: 24 }}>
        {label}
      </p>

      {/* Cycle dots */}
      <div style={{ display: 'flex', gap: spacing.sm }}>
        {Array.from({ length: cycles }).map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i < cycle ? p.accent : p.accentSoft,
            transition: 'background 0.4s',
          }} />
        ))}
      </div>
    </div>
  );
}
