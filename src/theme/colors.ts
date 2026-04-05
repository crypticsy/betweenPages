// ─── Florence Color System ────────────────────────────────────────────────────
// Based on Florence by Mountains/Annapurna Interactive.
//
// Key rules from the actual game:
//  - Florence's color is BLUE (melancholic when muted, warm when happy)
//  - Routine/mundane life = desaturated gray-blue wash over everything
//  - Joy/love = warm yellows and oranges flood the scene
//  - Conflict = gray backgrounds + RED puzzle pieces, sharp angles
//  - Growth = soft greens at the end
//  - Panel backgrounds = near-white, like scanned sketchbook paper (#FEFCF7)
//  - Panel borders = thin dark ink lines (#2A2018), comic style
//  - Objects (couch, walls) tint yellow during joy, gray during conflict

import { EmotionState } from '../types/story';

export interface Palette {
  // Scene / page
  pageBg: string;       // outermost background (the "page")
  panelBg: string;      // individual panel fill (sketchbook white)
  panelBorder: string;  // comic ink border
  panelShadow: string;
  // Text
  text: string;
  textSoft: string;
  // Accent — the dominant emotional tint on objects/backgrounds
  accent: string;       // strong accent (clothing, objects)
  accentSoft: string;   // soft accent (background wash)
  accentMid: string;    // mid-tone (furniture, props)
  // Speech bubbles
  bubbleBg: string;
  bubbleBorder: string;
  bubbleRadius: number; // 0 = sharp corners (conflict), 18 = round (positive)
  // Puzzle pieces
  puzzleFill: string;   // piece color
  puzzleStroke: string;
  puzzleSharp: boolean; // true = use sharp-corner tiles (conflict)
}

export const PALETTES: Record<EmotionState, Palette> = {
  // ── Routine / neutral ─────────────────────────────────────────────────────
  // Gray-blue wash. Florence's blue is muted and cold here.
  neutral: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FEFCF7',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.12)',
    text:         '#1A1410',
    textSoft:     '#3A3028',
    accent:       '#8AAABB',   // muted blue — Florence's color at rest
    accentSoft:   '#E4EDF0',
    accentMid:    '#B8CED6',
    bubbleBg:     '#FFFFFF',
    bubbleBorder: '#2A2018',
    bubbleRadius: 16,
    puzzleFill:   '#B8CED6',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },

  // ── Hopeful ───────────────────────────────────────────────────────────────
  // A hint of warmth starts creeping in — early yellows.
  hopeful: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FEFCF7',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.10)',
    text:         '#1A1410',
    textSoft:     '#3A3020',
    accent:       '#D4A820',   // warm gold
    accentSoft:   '#FBF0C0',
    accentMid:    '#E8CC70',
    bubbleBg:     '#FFFEF0',
    bubbleBorder: '#2A2018',
    bubbleRadius: 18,
    puzzleFill:   '#D4B840',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },

  // ── Excited ───────────────────────────────────────────────────────────────
  // Objects flood with yellow. Florence's blue warms to sky blue.
  excited: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FEFDF2',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.09)',
    text:         '#1A1410',
    textSoft:     '#3A3010',
    accent:       '#F0C428',   // bright yellow — joy
    accentSoft:   '#FEF5B0',
    accentMid:    '#F8DC70',
    bubbleBg:     '#FEFEE8',
    bubbleBorder: '#2A2018',
    bubbleRadius: 20,
    puzzleFill:   '#F0C428',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },

  // ── Romantic ──────────────────────────────────────────────────────────────
  // Warm pinks and peaches. The couch turns golden orange.
  romantic: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FEFCF8',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.10)',
    text:         '#1A1410',
    textSoft:     '#3A2028',
    accent:       '#E87090',   // warm pink
    accentSoft:   '#FDE0E8',
    accentMid:    '#F0A0B4',
    bubbleBg:     '#FFF4F6',
    bubbleBorder: '#2A2018',
    bubbleRadius: 20,
    puzzleFill:   '#E87090',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },

  // ── Comfortable ───────────────────────────────────────────────────────────
  // Settled warmth. Oranges and ambers. Couch = deep warm yellow.
  comfortable: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FEFCF6',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.09)',
    text:         '#1A1410',
    textSoft:     '#3A3018',
    accent:       '#E89030',   // amber orange
    accentSoft:   '#FEEAD8',
    accentMid:    '#F0B870',
    bubbleBg:     '#FFFAF2',
    bubbleBorder: '#2A2018',
    bubbleRadius: 18,
    puzzleFill:   '#E89030',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },

  // ── Tense ─────────────────────────────────────────────────────────────────
  // Color drains. Gray creeps back. Puzzle pieces start getting edges.
  tense: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FDFCFA',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.11)',
    text:         '#1A1410',
    textSoft:     '#383028',
    accent:       '#CC5040',   // muted red — tension
    accentSoft:   '#EDE8E4',
    accentMid:    '#C4B4A8',
    bubbleBg:     '#FDFAF8',
    bubbleBorder: '#2A2018',
    bubbleRadius: 8,           // corners start sharpening
    puzzleFill:   '#CC5040',
    puzzleStroke: '#2A2018',
    puzzleSharp:  true,
  },

  // ── Sad ───────────────────────────────────────────────────────────────────
  // Fully desaturated. Florence's blue returns but cold and flat.
  sad: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FDFCFA',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.10)',
    text:         '#1A1410',
    textSoft:     '#383838',
    accent:       '#7090A0',   // cold muted blue
    accentSoft:   '#E4E8EC',
    accentMid:    '#A8B8C4',
    bubbleBg:     '#FBFBFB',
    bubbleBorder: '#2A2018',
    bubbleRadius: 14,
    puzzleFill:   '#888080',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },

  // ── Broken ────────────────────────────────────────────────────────────────
  // Conflict. Gray background + RED sharp puzzle pieces (exact Florence look).
  broken: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FCFAF8',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.12)',
    text:         '#1A1410',
    textSoft:     '#383838',
    accent:       '#CC2828',   // conflict red
    accentSoft:   '#EDE8E4',
    accentMid:    '#AAAAAA',
    bubbleBg:     '#FAFAFA',
    bubbleBorder: '#2A2018',
    bubbleRadius: 2,           // fully sharp corners — argument
    puzzleFill:   '#CC2828',   // RED pieces
    puzzleStroke: '#2A2018',
    puzzleSharp:  true,
  },

  // ── Healing ───────────────────────────────────────────────────────────────
  // Soft sage greens emerge. Grief but with light.
  healing: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FDFEF8',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.09)',
    text:         '#1A1410',
    textSoft:     '#2A4028',
    accent:       '#70A870',
    accentSoft:   '#D4ECD4',
    accentMid:    '#98C498',
    bubbleBg:     '#F4FAF4',
    bubbleBorder: '#2A2018',
    bubbleRadius: 16,
    puzzleFill:   '#70A870',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },

  // ── Growth ────────────────────────────────────────────────────────────────
  // Florence finds herself. Clean greens, her blue returns warm and confident.
  growth: {
    pageBg:       '#F0EDE8',
    panelBg:      '#FDFEF8',
    panelBorder:  '#2A2018',
    panelShadow:  'rgba(42,32,24,0.08)',
    text:         '#1A1410',
    textSoft:     '#1A4018',
    accent:       '#50A858',
    accentSoft:   '#C8E8C8',
    accentMid:    '#80C080',
    bubbleBg:     '#F2FAF2',
    bubbleBorder: '#2A2018',
    bubbleRadius: 18,
    puzzleFill:   '#50A858',
    puzzleStroke: '#2A2018',
    puzzleSharp:  false,
  },
};

export const getPalette = (e: EmotionState): Palette =>
  PALETTES[e] ?? PALETTES.neutral;
