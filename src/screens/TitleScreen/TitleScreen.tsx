// ─── Title Screen ─────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { Story } from '../../types/story';
import bgImg from '../../assets/home-screen/background.png';

interface Props { story: Story; onStart: () => void }

export default function TitleScreen({ story: _story, onStart }: Props) {
  return (
    <motion.div
      onClick={onStart}
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
      <div className="flex-1" />

      {/* Text block */}
      <div className="relative z-20 flex flex-col items-center gap-3" style={{paddingBottom:"100px"}}>

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
    </motion.div>
  );
}
