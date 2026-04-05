// ─── Story Data Types ─────────────────────────────────────────────────────────

export type EmotionState =
  | 'neutral'
  | 'hopeful'
  | 'excited'
  | 'romantic'
  | 'comfortable'
  | 'tense'
  | 'sad'
  | 'broken'
  | 'healing'
  | 'growth';

export type MiniGameType =
  | 'conversation_puzzle'
  | 'breathing'
  | 'matching'
  | 'polaroid';

export type PanelLayout =
  | 'full'
  | 'half_h'
  | 'featured_top'
  | 'featured_bottom';

export type CharacterExpression =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'surprised'
  | 'thoughtful'
  | 'laughing'
  | 'crying'
  | 'determined'
  | 'embarrassed'
  | 'longing';

export interface Character {
  id: string;
  name: string;
  color: string;
}

export interface PanelContent {
  id: string;
  type: 'character' | 'environment' | 'abstract';
  character?: string;
  expression?: CharacterExpression;
  backgroundAsset?: string;
  overlayText?: string;
  narration?: string;
}

export interface Panel {
  id: string;
  content: PanelContent[];
  layout: PanelLayout;
  emotion: EmotionState;
  tapToContinue?: boolean;
}

export interface SentenceChallenge {
  template: string;          // e.g. "My name is ____ and I ____ music."
  answers: string[];         // correct words in blank order
  distractors: string[];     // wrong words shown alongside answers
}

export interface MiniGameConfig {
  pieceCount?: number;
  speakerA?: string;
  speakerB?: string;
  cycles?: number;
  pairs?: Array<{ left: string; right: string }>;
  imagePairs?: Array<{ caption?: string; label: string }>;
  sentences?: SentenceChallenge[];
}

export interface PanelScene {
  id: string;
  type: 'panel_sequence';
  emotion: EmotionState;
  panels: Panel[];
}

export interface MiniGameScene {
  id: string;
  type: MiniGameType;
  emotion: EmotionState;
  config: MiniGameConfig;
}

export type Scene = PanelScene | MiniGameScene;

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  emotion: EmotionState;
  scenes: Scene[];
}

export interface Story {
  id: string;
  title: string;
  chapters: Chapter[];
  characters: Record<string, Character>;
}
