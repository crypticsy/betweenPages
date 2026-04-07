// ─── Environment Illustration ─────────────────────────────────────────────────
// Hand-sketched scene backgrounds matching Florence's scanned-illustration look:
// thin dark ink lines on near-white paper, accent color fills tinted by emotion.
// Objects (walls, furniture) shift color with the emotional palette.

import React from 'react';
import { useEmotion } from '../../systems/EmotionContext';

interface Props {
  assetKey: string;
  width: number;
  height: number;
}

export default function EnvironmentIllustration({ assetKey, width: w, height: h }: Props) {
  const { palette: p } = useEmotion();
  const ink   = p.panelBorder;   // dark ink lines
  const fill  = p.accentSoft;    // light scene fill (tinted by emotion)
  const mid   = p.accentMid;     // mid-tone objects
  const obj   = p.accent;        // prominent objects (couch, walls)

  const scenes: Record<string, React.ReactElement> = {

    // ── Bedroom ──────────────────────────────────────────────────────────────
    bedroom: (
      <g>
        {/* Sketchbook paper bg */}
        <rect width={w} height={h} fill={p.panelBg} />
        {/* Floor line */}
        <line x1={0} y1={h*0.76} x2={w} y2={h*0.76} stroke={ink} strokeWidth={1.5} />
        {/* Bed frame */}
        <rect x={w*0.06} y={h*0.5} width={w*0.55} height={h*0.28} rx={5}
          fill={mid} stroke={ink} strokeWidth={1.5} />
        {/* Pillow */}
        <rect x={w*0.08} y={h*0.44} width={w*0.18} height={h*0.14} rx={5}
          fill={fill} stroke={ink} strokeWidth={1.5} />
        {/* Blanket fold line */}
        <line x1={w*0.06} y1={h*0.62} x2={w*0.61} y2={h*0.62} stroke={ink} strokeWidth={1} strokeDasharray="4 3" />
        {/* Window */}
        <rect x={w*0.67} y={h*0.08} width={w*0.26} height={h*0.32} rx={3}
          fill={fill} stroke={ink} strokeWidth={1.5} />
        <line x1={w*0.67} y1={h*0.24} x2={w*0.93} y2={h*0.24} stroke={ink} strokeWidth={1} />
        <line x1={w*0.80} y1={h*0.08} x2={w*0.80} y2={h*0.40} stroke={ink} strokeWidth={1} />
        {/* Window light glow */}
        <rect x={w*0.68} y={h*0.09} width={w*0.11} height={h*0.14} rx={2} fill={obj} opacity={0.2} />
        {/* Small nightstand */}
        <rect x={w*0.64} y={h*0.6} width={w*0.12} height={h*0.16} rx={3}
          fill={fill} stroke={ink} strokeWidth={1.2} />
        {/* Alarm clock dot */}
        <circle cx={w*0.70} cy={h*0.63} r={3} fill={ink} opacity={0.5} />
      </g>
    ),

    // ── Park ─────────────────────────────────────────────────────────────────
    park: (
      <g>
        <rect width={w} height={h} fill={fill} opacity={0.4} />
        <rect x={0} y={0} width={w} height={h} fill={p.panelBg} opacity={0.5} />
        {/* Ground */}
        <rect x={0} y={h*0.7} width={w} height={h*0.3} fill={mid} opacity={0.35} />
        <line x1={0} y1={h*0.7} x2={w} y2={h*0.7} stroke={ink} strokeWidth={1.5} />
        {/* Grass tufts */}
        {[0.05,0.18,0.35,0.55,0.7,0.85].map((x,i) => (
          <path key={i}
            d={`M${w*x} ${h*0.7} Q${w*x+4} ${h*0.66} ${w*x+8} ${h*0.7}`}
            stroke={ink} strokeWidth={1} fill="none" />
        ))}
        {/* Tree trunk */}
        <rect x={w*0.14} y={h*0.38} width={9} height={h*0.33}
          fill={mid} stroke={ink} strokeWidth={1.2} rx={2} />
        {/* Tree foliage — layered circles, ink outline */}
        <circle cx={w*0.18} cy={h*0.30} r={26} fill={obj} opacity={0.55} stroke={ink} strokeWidth={1.5} />
        <circle cx={w*0.12} cy={h*0.36} r={18} fill={mid} opacity={0.4} stroke={ink} strokeWidth={1} />
        <circle cx={w*0.24} cy={h*0.34} r={15} fill={mid} opacity={0.35} stroke={ink} strokeWidth={1} />
        {/* Park bench */}
        <rect x={w*0.54} y={h*0.62} width={w*0.32} height={6} rx={3}
          fill={fill} stroke={ink} strokeWidth={1.2} />
        <line x1={w*0.57} y1={h*0.65} x2={w*0.57} y2={h*0.73} stroke={ink} strokeWidth={1.2} />
        <line x1={w*0.82} y1={h*0.65} x2={w*0.82} y2={h*0.73} stroke={ink} strokeWidth={1.2} />
        {/* Clouds */}
        <ellipse cx={w*0.35} cy={h*0.13} rx={32} ry={12} fill="#fff" opacity={0.75} stroke={ink} strokeWidth={1} />
        <ellipse cx={w*0.25} cy={h*0.15} rx={20} ry={10} fill="#fff" opacity={0.6} />
        <ellipse cx={w*0.78} cy={h*0.18} rx={24} ry={10} fill="#fff" opacity={0.65} stroke={ink} strokeWidth={1} />
        {/* Sun / warm glow circle */}
        <circle cx={w*0.88} cy={h*0.1} r={14} fill={obj} opacity={0.3} stroke={ink} strokeWidth={1} />
      </g>
    ),

    // ── City street ───────────────────────────────────────────────────────────
    city_street: (
      <g>
        <rect width={w} height={h} fill={p.panelBg} />
        {/* Buildings — ink outline, accent fill */}
        <rect x={0}      y={h*0.15} width={w*0.25} height={h*0.55} fill={fill}  stroke={ink} strokeWidth={1.5} rx={2} />
        <rect x={w*0.27} y={h*0.05} width={w*0.30} height={h*0.65} fill={mid}   stroke={ink} strokeWidth={1.5} rx={2} />
        <rect x={w*0.61} y={h*0.20} width={w*0.39} height={h*0.50} fill={fill}  stroke={ink} strokeWidth={1.5} rx={2} />
        {/* Windows — small rectangles */}
        {[0,1,2].map(r => [0,1].map(c => (
          <rect key={`L${r}${c}`}
            x={w*0.04 + c*12} y={h*0.22 + r*14}
            width={8} height={10} rx={1}
            fill={obj} opacity={0.35} stroke={ink} strokeWidth={0.8} />
        )))}
        {[0,1,2,3].map(r => [0,1,2].map(c => (
          <rect key={`M${r}${c}`}
            x={w*0.32 + c*10} y={h*0.10 + r*14}
            width={7} height={9} rx={1}
            fill={obj} opacity={0.3} stroke={ink} strokeWidth={0.8} />
        )))}
        {/* Road */}
        <rect x={0} y={h*0.7} width={w} height={h*0.3} fill={mid} opacity={0.3} />
        <line x1={0} y1={h*0.7} x2={w} y2={h*0.7} stroke={ink} strokeWidth={1.5} />
        {/* Road dashes */}
        {[0.1,0.3,0.5,0.7,0.9].map((x,i) => (
          <rect key={i} x={w*x} y={h*0.82} width={w*0.08} height={3} rx={1.5}
            fill={p.panelBg} opacity={0.6} />
        ))}
        {/* Lamp post */}
        <line x1={w*0.48} y1={h*0.7} x2={w*0.48} y2={h*0.22} stroke={ink} strokeWidth={1.8} />
        <path d={`M${w*0.48} ${h*0.22} Q${w*0.52} ${h*0.16} ${w*0.56} ${h*0.18}`} stroke={ink} strokeWidth={1.5} fill="none" />
        <circle cx={w*0.56} cy={h*0.18} r={4} fill={obj} opacity={0.5} stroke={ink} strokeWidth={1} />
      </g>
    ),

    // ── Coffee shop ───────────────────────────────────────────────────────────
    coffee_shop: (
      <g>
        <rect width={w} height={h} fill={p.panelBg} />
        {/* Back wall with warm tint */}
        <rect x={0} y={0} width={w} height={h*0.72} fill={fill} opacity={0.5} />
        {/* Floor */}
        <rect x={0} y={h*0.72} width={w} height={h*0.28} fill={mid} opacity={0.25} />
        <line x1={0} y1={h*0.72} x2={w} y2={h*0.72} stroke={ink} strokeWidth={1.5} />
        {/* Window with condensation lines */}
        <rect x={w*0.04} y={h*0.07} width={w*0.35} height={h*0.28} rx={3}
          fill={fill} stroke={ink} strokeWidth={1.5} />
        <line x1={w*0.04} y1={h*0.21} x2={w*0.39} y2={h*0.21} stroke={ink} strokeWidth={1} />
        {/* Table */}
        <ellipse cx={w/2} cy={h*0.67} rx={w*0.28} ry={h*0.065}
          fill={obj} stroke={ink} strokeWidth={1.5} opacity={0.7} />
        <line x1={w/2} y1={h*0.73} x2={w/2} y2={h*0.92} stroke={ink} strokeWidth={2} />
        {/* Two coffee cups */}
        {[w*0.37, w*0.57].map((cx, i) => (
          <g key={i}>
            <rect x={cx} y={h*0.56} width={18} height={16} rx={3}
              fill={p.panelBg} stroke={ink} strokeWidth={1.3} />
            <ellipse cx={cx + 9} cy={h*0.56} rx={9} ry={3}
              fill={mid} opacity={0.55} />
            {/* Steam lines */}
            <path d={`M${cx+5} ${h*0.54} Q${cx+7} ${h*0.50} ${cx+5} ${h*0.46}`}
              stroke={ink} strokeWidth={0.8} fill="none" opacity={0.4} />
            <path d={`M${cx+12} ${h*0.54} Q${cx+14} ${h*0.49} ${cx+12} ${h*0.45}`}
              stroke={ink} strokeWidth={0.8} fill="none" opacity={0.4} />
          </g>
        ))}
        {/* Menu board */}
        <rect x={w*0.72} y={h*0.08} width={w*0.22} height={h*0.24} rx={2}
          fill={mid} stroke={ink} strokeWidth={1.2} opacity={0.7} />
        <line x1={w*0.75} y1={h*0.14} x2={w*0.91} y2={h*0.14} stroke={ink} strokeWidth={0.8} opacity={0.5} />
        <line x1={w*0.75} y1={h*0.19} x2={w*0.88} y2={h*0.19} stroke={ink} strokeWidth={0.8} opacity={0.5} />
        <line x1={w*0.75} y1={h*0.24} x2={w*0.90} y2={h*0.24} stroke={ink} strokeWidth={0.8} opacity={0.5} />
      </g>
    ),

    // ── Apartment interior ────────────────────────────────────────────────────
    apartment: (
      <g>
        <rect width={w} height={h} fill={p.panelBg} />
        {/* Floor line */}
        <line x1={0} y1={h*0.76} x2={w} y2={h*0.76} stroke={ink} strokeWidth={1.5} />
        <rect x={0} y={h*0.76} width={w} height={h*0.24} fill={mid} opacity={0.2} />
        {/* Couch — key object, color shifts with emotion */}
        <rect x={w*0.08} y={h*0.54} width={w*0.52} height={h*0.24} rx={7}
          fill={obj} stroke={ink} strokeWidth={1.5} opacity={0.8} />
        <rect x={w*0.08} y={h*0.46} width={w*0.14} height={h*0.14} rx={5}
          fill={obj} stroke={ink} strokeWidth={1.2} opacity={0.75} />
        <rect x={w*0.46} y={h*0.46} width={w*0.14} height={h*0.14} rx={5}
          fill={obj} stroke={ink} strokeWidth={1.2} opacity={0.75} />
        {/* Cushion detail */}
        <line x1={w*0.34} y1={h*0.54} x2={w*0.34} y2={h*0.78} stroke={ink} strokeWidth={1} opacity={0.4} />
        {/* Bookshelf */}
        <rect x={w*0.7} y={h*0.08} width={w*0.26} height={h*0.66} rx={3}
          fill={fill} stroke={ink} strokeWidth={1.5} opacity={0.6} />
        {[0,1,2,3,4].map(i => (
          <rect key={i}
            x={w*0.73} y={h*(0.13 + i*0.12)}
            width={w*0.18} height={h*0.09}
            rx={2} fill={mid} stroke={ink} strokeWidth={0.8}
            opacity={0.6 + i*0.05} />
        ))}
        {/* Plant */}
        <rect x={w*0.12} y={h*0.60} width={11} height={h*0.17} rx={3}
          fill={mid} stroke={ink} strokeWidth={1.2} />
        <ellipse cx={w*0.17} cy={h*0.54} rx={17} ry={15}
          fill={obj} stroke={ink} strokeWidth={1.2} opacity={0.6} />
        <ellipse cx={w*0.11} cy={h*0.49} rx={12} ry={10}
          fill={mid} opacity={0.45} />
      </g>
    ),

    // ── Abstract memory / transition ──────────────────────────────────────────
    abstract_memory: (
      <g>
        <rect width={w} height={h} fill={p.panelBg} />
        {/* Watercolour wash circles — soft ink rings */}
        <circle cx={w*0.5} cy={h*0.5} r={h*0.40}
          fill={fill} opacity={0.5} />
        <circle cx={w*0.5} cy={h*0.5} r={h*0.40}
          fill="none" stroke={ink} strokeWidth={0.8} opacity={0.15} />
        <circle cx={w*0.3} cy={h*0.4} r={h*0.25}
          fill={mid} opacity={0.3} />
        <circle cx={w*0.7} cy={h*0.6} r={h*0.20}
          fill={obj} opacity={0.2} />
        {/* Central dot */}
        <circle cx={w*0.5} cy={h*0.5} r={5}
          fill={obj} opacity={0.45} stroke={ink} strokeWidth={1} />
      </g>
    ),
  };

  const content = scenes[assetKey];

  if (assetKey.startsWith('ch1_')) {
    const imageUrl = new URL(`../../assets/chapters/${assetKey}.png`, import.meta.url).href;
    return (
      <img
        src={imageUrl}
        alt={assetKey}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          borderRadius: 'inherit'
        }}
      />
    );
  }

  const svgContent = content ?? scenes.abstract_memory;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: 'block', borderRadius: 'inherit' }}
    >
      {svgContent}
    </svg>
  );
}
