// ─── Title Screen ─────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { Story } from '../../types/story';
import { fonts, spacing } from '../../theme';

import bgImg    from '../../assets/home-screen/background.png';
import booksImg from '../../assets/home-screen/books.png';
import teddyImg from '../../assets/home-screen/teddy.png';
import girlImg  from '../../assets/home-screen/girl.png';
import boyImg   from '../../assets/home-screen/boy.png';

const layerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center bottom',
};

interface Props { story: Story; onStart: () => void }

export default function TitleScreen({ story: _story, onStart }: Props) {
  return (
    <motion.div
      onClick={onStart}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: '100%',
        height: '100%',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Layered illustration — stacked, no movement */}
      <img src={bgImg}    alt="" style={layerStyle} draggable={false} />
      <img src={booksImg} alt="" style={layerStyle} draggable={false} />
      <img src={teddyImg} alt="" style={layerStyle} draggable={false} />
      <img src={girlImg}  alt="" style={layerStyle} draggable={false} />
      <img src={boyImg}   alt="" style={layerStyle} draggable={false} />

      {/* Vignette — fades all edges into the page background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at center, transparent 40%, #1a1a2e 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Text glow — anchored to the screen, wider than viewport so gradient never hits a wall */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200%',
        height: '55%',
        background: 'radial-gradient(ellipse at center bottom, rgba(0,0,0,0.6) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Text block — white, sits at the bottom */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: spacing.xxl,
        gap: spacing.sm,
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: "'Barrio', cursive",
            fontSize: 'clamp(36px, 10vw, 56px)',
            letterSpacing: '0.06em',
            color: '#ffffff',
            margin: 0,
            textAlign: 'center',
            textTransform: 'capitalize',
          }}
        >
          Between Pages
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.7 }}
          style={{
            fontFamily: fonts.sans,
            fontSize: 17,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: '0.06em',
            margin: 0,
            textTransform: 'capitalize',
          }}
        >
          a story in chapters
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ delay: 1.8, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: fonts.sans,
            fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.18em',
            margin: 0,
            marginTop: spacing.sm,
          }}
        >
          Tap anywhere to begin
        </motion.p>
      </div>
    </motion.div>
  );
}
