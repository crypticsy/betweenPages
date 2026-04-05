// ─── Emotion Context ──────────────────────────────────────────────────────────
// Provides the current palette to the component tree.
// Framer-motion animate() handles the CSS-variable transitions in GameScreen.

import { createContext, useContext, ReactNode } from 'react';
import { EmotionState } from '../types/story';
import { Palette, getPalette } from '../theme/colors';

interface EmotionCtx {
  emotion: EmotionState;
  palette: Palette;
}

const Ctx = createContext<EmotionCtx>({
  emotion: 'neutral',
  palette: getPalette('neutral'),
});

export function EmotionProvider({
  emotion,
  children,
}: {
  emotion: EmotionState;
  children: ReactNode;
}) {
  return (
    <Ctx.Provider value={{ emotion, palette: getPalette(emotion) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useEmotion(): EmotionCtx {
  return useContext(Ctx);
}
