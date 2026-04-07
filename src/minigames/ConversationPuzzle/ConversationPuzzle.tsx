import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../systems/EmotionContext';
import { fonts, spacing } from '../../theme';
import { SentenceChallenge } from '../../types/story';
import CharacterSprite from '../../components/Character/CharacterSprite';

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseTemplate(template: string): string[] {
  return template.split('____');
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface Chip {
  id: string;
  word: string;
  placed: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  sentences?: SentenceChallenge[];
  onComplete: () => void;
}

const defaultSentences: SentenceChallenge[] = [
  {
    template: 'I couldn\'t help but ____.',
    answers: ['notice'],
    distractors: ['stare', 'laugh', 'wonder', 'speak'],
    speaker: 'protagonist',
  },
];

export default function ConversationPuzzle({ sentences = defaultSentences, onComplete }: Props) {
  const { palette: p } = useEmotion();
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [history, setHistory] = useState<SentenceChallenge[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sentence = sentences[sentenceIdx];
  const isProtagonist = !sentence?.speaker || sentence.speaker === 'protagonist';

  // Handling message timing and thinking states
  useEffect(() => {
    if (!sentence) return;

    if (!isProtagonist) {
      setIsThinking(false);
      const timer = setTimeout(() => {
        handleSentenceDone();
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      // Protagonist "thinks" before the blanks appear
      setIsThinking(true);
      const timer = setTimeout(() => {
        setIsThinking(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [sentenceIdx, isProtagonist]);

  // Scroll to bottom when history or active sentence changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, sentenceIdx]);

  const handleSentenceDone = () => {
    const current = sentences[sentenceIdx];
    if (!current) return;
    
    setHistory(prev => [...prev, current]);
    const next = sentenceIdx + 1;
    
    // Always increment index to hide the current bubble
    setSentenceIdx(next);
    
    if (next >= sentences.length) {
      setTimeout(onComplete, 800);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: 600,
      margin: '0 auto',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Scrollable Conversation Area */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: `${spacing.xl}px ${spacing.lg}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xl,
          scrollbarWidth: 'none',
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        {/* Previous bubbles */}
        {history.map((h, i) => (
          <StaticBubble key={`h-${i}`} sentence={h} palette={p} isHistory />
        ))}

        {/* Current bubble */}
        {sentence && (
          <AnimatePresence mode="wait">
            <motion.div
              key={sentenceIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {isProtagonist ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: spacing.md }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.sm, maxWidth: '85%' }}>
                    <div style={{ 
                      padding: isThinking ? `${spacing.sm}px ${spacing.lg}px` : `${spacing.md}px ${spacing.lg}px`,
                      background: p.panelBg,
                      border: `1.5px solid ${p.panelBorder}`,
                      borderRadius: '16px 16px 4px 16px',
                      boxShadow: `0 2px 8px ${p.panelShadow}`,
                      minHeight: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isThinking ? (
                        <ThinkingDots palette={p} />
                      ) : (
                        <SentenceFill
                          sentence={sentence}
                          palette={p}
                          onComplete={handleSentenceDone}
                        />
                      )}
                    </div>
                    <CharacterSprite characterId="protagonist" expression="neutral" size={32} />
                  </div>
                </div>
              ) : (
                <StaticBubble sentence={sentence} palette={p} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Static Bubble (Eli or History) ───────────────────────────────────────────

interface StaticProps {
  sentence: SentenceChallenge;
  palette: any;
  isHistory?: boolean;
}

function StaticBubble({ sentence, palette: p, isHistory }: StaticProps) {
  const isProtag = !sentence.speaker || sentence.speaker === 'protagonist';
  
  // Fill the template for display
  const fullText = sentence.template.split('____').reduce((acc, part, i) => {
    return acc + part + (sentence.answers[i] || '');
  }, '');

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: isProtag ? 'flex-end' : 'flex-start',
      opacity: isHistory ? 0.65 : 1,
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: spacing.sm, 
        maxWidth: '85%',
        flexDirection: isProtag ? 'row' : 'row-reverse' 
      }}>
        <div style={{ 
          padding: `${spacing.md}px ${spacing.lg}px`,
          background: isProtag ? p.accentSoft : p.panelBg,
          border: `1.5px solid ${isProtag ? p.accentMid : p.panelBorder}`,
          borderRadius: isProtag ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          fontFamily: fonts.serif,
          fontSize: 17,
          color: p.text,
          lineHeight: 2.2,
          boxShadow: isHistory ? 'none' : `0 2px 8px ${p.panelShadow}`,
        }}>
          {fullText}
        </div>
        <CharacterSprite 
          characterId={sentence.speaker || 'protagonist'} 
          expression={sentence.expression || 'neutral'}
          size={32} 
        />
      </div>
    </div>
  );
}

// ── Sentence Fill (The Actual Game, Protagonist only) ─────────────────────────

interface SFProps {
  sentence: SentenceChallenge;
  palette: any;
  onComplete: () => void;
}

function SentenceFill({ sentence, palette: p, onComplete }: SFProps) {
  const parts = useMemo(() => parseTemplate(sentence.template), [sentence.template]);
  const blankCount = parts.length - 1;

  const [blanks, setBlanks] = useState<(string | null)[]>(() => Array(blankCount).fill(null));
  const [chips, setChips] = useState<Chip[]>(() =>
    shuffle([...sentence.answers, ...sentence.distractors]).map((w, i) => ({
      id: `chip-${i}`,
      word: w,
      placed: false,
    }))
  );

  const [shake, setShake] = useState(false);
  const [done, setDone] = useState(false);

  const nextEmpty = blanks.findIndex(b => b === null);

  const tapChip = (chip: Chip) => {
    if (chip.placed || done) return;
    if (nextEmpty === -1) return;

    setChips(prev => prev.map(c => c.id === chip.id ? { ...c, placed: true } : c));
    const newBlanks = [...blanks];
    newBlanks[nextEmpty] = chip.id;
    setBlanks(newBlanks);

    const allFilled = newBlanks.every(b => b !== null);
    if (allFilled) {
      const correct = newBlanks.every((cid, idx) => {
        const found = chips.find(c => c.id === cid);
        return found?.word === sentence.answers[idx];
      });
      if (correct) {
        setDone(true);
        setTimeout(onComplete, 500);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setBlanks(Array(blankCount).fill(null));
          setChips(prev => prev.map(c => ({ ...c, placed: false })));
        }, 600);
      }
    }
  };

  const tapBlank = (blankIdx: number) => {
    if (done) return;
    const cid = blanks[blankIdx];
    if (!cid) return;
    const newBlanks = [...blanks];
    newBlanks[blankIdx] = null;
    setBlanks(newBlanks);
    setChips(prev => prev.map(c => c.id === cid ? { ...c, placed: false } : c));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
      <motion.div
        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontFamily: fonts.serif,
          fontSize: 18,
          lineHeight: 2.6,
          color: p.text,
          textAlign: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {parts.map((part, idx) => (
          <span key={idx} style={{ display: 'contents' }}>
            {part && <span style={{ whiteSpace: 'pre-wrap' }}>{part}</span>}
            {idx < blankCount && (
              <Blank
                chipId={blanks[idx]}
                chips={chips}
                palette={p}
                onClick={() => tapBlank(idx)}
                done={done}
              />
            )}
          </span>
        ))}
      </motion.div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
        marginTop: 4,
      }}>
        {chips.map(chip => (
          <WordChip
            key={chip.id}
            chip={chip}
            palette={p}
            onClick={() => tapChip(chip)}
            done={done}
          />
        ))}
      </div>
    </div>
  );
}

// ── UI Components ─────────────────────────────────────────────────────────────

function Blank({ chipId, chips, palette: p, onClick, done }: any) {
  const chip = chipId ? chips.find((c: any) => c.id === chipId) : null;
  return (
    <motion.button
      onClick={onClick}
      style={{
        minWidth: chip ? 'auto' : 48,
        height: 26,
        padding: chip ? '0 8px' : '0',
        borderRadius: 4,
        border: `1px solid ${chip ? p.accentMid : p.textSoft}`,
        background: chip ? p.accentSoft : 'transparent',
        cursor: chip && !done ? 'pointer' : 'default',
        fontFamily: fonts.serif,
        fontSize: 16,
        color: p.text,
        margin: '0 2px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {chip ? chip.word : <span style={{ opacity: 0.3 }}>____</span>}
    </motion.button>
  );
}

function WordChip({ chip, palette: p, onClick, done }: any) {
  return (
    <AnimatePresence>
      {!chip.placed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={!done ? { scale: 1.05 } : {}}
          whileTap={!done ? { scale: 0.95 } : {}}
          onClick={onClick}
          style={{
            padding: '4px 12px',
            borderRadius: 16,
            border: `1px solid ${p.accentSoft}`,
            background: p.panelBg,
            fontFamily: fonts.serif,
            fontSize: 15,
            color: p.text,
            cursor: done ? 'default' : 'pointer',
            boxShadow: `0 2px 6px ${p.panelShadow}`,
          }}
        >
          {chip.word}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ── Thinking Indicator ────────────────────────────────────────────────────────

function ThinkingDots({ palette: p }: { palette: any }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: p.accentMid,
          }}
        />
      ))}
    </div>
  );
}
