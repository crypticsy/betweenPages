// ─── Story Engine ─────────────────────────────────────────────────────────────
// Central state machine. Tracks current chapter/scene/panel and emotion.
// Exposes a React context so any component can read or advance the story.

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Story, Chapter, Scene, EmotionState, PanelScene } from '../types/story';

// ─── State ────────────────────────────────────────────────────────────────────

interface Progress {
  chapterId: string;
  sceneId: string;
  panelIndex: number;
  emotion: EmotionState;
  completedChapters: string[];
  completedScenes: string[];
}

type Action =
  | { type: 'NEXT_PANEL' }
  | { type: 'NEXT_SCENE' }
  | { type: 'NEXT_CHAPTER' }
  | { type: 'JUMP'; progress: Partial<Progress> };

function reducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'NEXT_PANEL':
      return { ...state, panelIndex: state.panelIndex + 1 };
    case 'NEXT_SCENE':
      return {
        ...state,
        panelIndex: 0,
        completedScenes: [...state.completedScenes, state.sceneId],
      };
    case 'NEXT_CHAPTER':
      return {
        ...state,
        panelIndex: 0,
        completedChapters: [...state.completedChapters, state.chapterId],
      };
    case 'JUMP':
      return { ...state, ...action.progress };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface EngineCtx {
  story: Story;
  chapter: Chapter | null;
  scene: Scene | null;
  panelIndex: number;
  emotion: EmotionState;
  isLastPanel: boolean;
  isLastScene: boolean;
  isLastChapter: boolean;
  isDone: boolean;
  advancePanel: () => void;
  advanceScene: () => void;
  advanceChapter: () => void;
  jumpToChapter: (id: string) => void;
}

const Ctx = createContext<EngineCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoryEngineProvider({
  story,
  children,
}: {
  story: Story;
  children: ReactNode;
}) {
  const firstChapter = story.chapters[0];
  const firstScene = firstChapter?.scenes[0];

  const [progress, dispatch] = useReducer(reducer, {
    chapterId: firstChapter?.id ?? '',
    sceneId: firstScene?.id ?? '',
    panelIndex: 0,
    emotion: firstChapter?.emotion ?? 'neutral',
    completedChapters: [],
    completedScenes: [],
  });

  const chapter = useMemo(
    () => story.chapters.find(c => c.id === progress.chapterId) ?? null,
    [story, progress.chapterId],
  );

  const scene = useMemo(
    () => chapter?.scenes.find(s => s.id === progress.sceneId) ?? null,
    [chapter, progress.sceneId],
  );

  const panelCount =
    scene?.type === 'panel_sequence'
      ? (scene as PanelScene).panels.length
      : 0;

  const sceneIndex = chapter?.scenes.findIndex(s => s.id === scene?.id) ?? -1;
  const chapterIndex = story.chapters.findIndex(c => c.id === chapter?.id);

  const isLastPanel = progress.panelIndex >= panelCount - 1;
  const isLastScene = sceneIndex >= (chapter?.scenes.length ?? 0) - 1;
  const isLastChapter = chapterIndex >= story.chapters.length - 1;
  const isDone = isLastChapter && isLastScene && isLastPanel;

  const advancePanel = useCallback(() => {
    if (isLastPanel) {
      advanceScene();
      return;
    }
    dispatch({ type: 'NEXT_PANEL' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLastPanel]);

  const advanceScene = useCallback(() => {
    dispatch({ type: 'NEXT_SCENE' });
    if (isLastScene) {
      if (!isLastChapter) {
        // move to next chapter
        const nextChapter = story.chapters[chapterIndex + 1];
        const nextScene = nextChapter?.scenes[0];
        dispatch({
          type: 'JUMP',
          progress: {
            chapterId: nextChapter?.id ?? '',
            sceneId: nextScene?.id ?? '',
            panelIndex: 0,
            emotion: nextChapter?.emotion ?? progress.emotion,
            completedChapters: [...progress.completedChapters, progress.chapterId],
            completedScenes: [...progress.completedScenes, progress.sceneId],
          },
        });
      }
      return;
    }
    const nextScene = chapter?.scenes[sceneIndex + 1];
    if (nextScene) {
      dispatch({
        type: 'JUMP',
        progress: {
          sceneId: nextScene.id,
          panelIndex: 0,
          emotion: nextScene.emotion ?? progress.emotion,
          completedScenes: [...progress.completedScenes, progress.sceneId],
        },
      });
    }
  }, [
    isLastScene, isLastChapter, chapter, sceneIndex, chapterIndex,
    story.chapters, progress,
  ]);

  const advanceChapter = useCallback(() => {
    if (isLastChapter) return;
    const nextChapter = story.chapters[chapterIndex + 1];
    const nextScene = nextChapter?.scenes[0];
    dispatch({
      type: 'JUMP',
      progress: {
        chapterId: nextChapter?.id ?? '',
        sceneId: nextScene?.id ?? '',
        panelIndex: 0,
        emotion: nextChapter?.emotion ?? progress.emotion,
        completedChapters: [...progress.completedChapters, progress.chapterId],
      },
    });
  }, [isLastChapter, chapterIndex, story.chapters, progress]);

  const jumpToChapter = useCallback(
    (id: string) => {
      const ch = story.chapters.find(c => c.id === id);
      if (!ch) return;
      const sc = ch.scenes[0];
      dispatch({
        type: 'JUMP',
        progress: {
          chapterId: id,
          sceneId: sc?.id ?? '',
          panelIndex: 0,
          emotion: ch.emotion,
        },
      });
    },
    [story.chapters],
  );

  return (
    <Ctx.Provider
      value={{
        story,
        chapter,
        scene,
        panelIndex: progress.panelIndex,
        emotion: progress.emotion,
        isLastPanel,
        isLastScene,
        isLastChapter,
        isDone,
        advancePanel,
        advanceScene,
        advanceChapter,
        jumpToChapter,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStory(): EngineCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStory must be used inside StoryEngineProvider');
  return ctx;
}
