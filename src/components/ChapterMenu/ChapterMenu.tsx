import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chapter } from '../../types/story';
import { IoCloseOutline, IoLockClosedOutline } from 'react-icons/io5';

interface ChapterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  onJumpToChapter: (id: string) => void;
  currentChapterId?: string;
  completedChapters: string[];
}

const ChapterMenu: React.FC<ChapterMenuProps> = ({
  isOpen,
  onClose,
  chapters,
  onJumpToChapter,
  currentChapterId,
  completedChapters,
}) => {
  // A chapter is unlocked if it's the current one, has been completed, 
  // or if its index is before the highest completed chapter.
  const maxCompletedIndex = Math.max(
    -1,
    ...completedChapters.map(id => chapters.findIndex(c => c.id === id))
  );
  
  const currentChapterIndex = chapters.findIndex(c => c.id === currentChapterId);
  const highestReachedIndex = Math.max(maxCompletedIndex + 1, currentChapterIndex);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            // Transparent backdrop to handle "click outside to close"
            background: 'transparent',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95, originX: 0.9, originY: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              position: 'absolute',
              top: '75px', // Below the button group
              right: '25px',
              width: '280px',
              background: '#FEFCF7', // sketchbook white
              borderRadius: '16px',
              border: '2px solid #2A2018',
              boxShadow: '0 12px 32px rgba(42, 32, 24, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tooltip Arrow */}
            <div style={{
              position: 'absolute',
              top: -8,
              right: 20,
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #2A2018',
            }} />

            {/* Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1.5px solid #2A2018',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F0EDE8'
            }}>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                color: '#2A2018',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Chapters
              </span>
              <button 
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#2A2018',
                  padding: '2px',
                  display: 'flex',
                }}
              >
                <IoCloseOutline size={20} />
              </button>
            </div>

            {/* List */}
            <div style={{ 
              padding: '8px', 
              overflowY: 'auto',
              flex: 1,
              // Custom scrollbar styling
              scrollbarWidth: 'thin',
              scrollbarColor: '#2A2018 transparent'
            }}>
              {chapters.map((chapter, index) => {
                const isUnlocked = index <= highestReachedIndex;
                const isCurrent = chapter.id === currentChapterId;

                return (
                  <motion.button
                    key={chapter.id}
                    whileHover={isUnlocked ? { background: '#F8F5F0', x: 4 } : {}}
                    whileTap={isUnlocked ? { scale: 0.98 } : {}}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) {
                        onJumpToChapter(chapter.id);
                        onClose();
                      }
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px',
                      marginBottom: '4px',
                      borderRadius: '10px',
                      border: isCurrent ? '1.5px solid #2A2018' : '1px solid transparent',
                      background: isCurrent ? '#FFFEE8' : 'transparent',
                      cursor: isUnlocked ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'all 0.2s ease',
                      opacity: isUnlocked ? 1 : 0.5,
                      position: 'relative',
                      filter: isUnlocked ? 'none' : 'grayscale(0.5)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: 700, 
                        color: '#2A2018' 
                      }}>
                        {chapter.title}
                      </span>
                      {!isUnlocked && <IoLockClosedOutline size={14} color="#2A2018" style={{ opacity: 0.6 }} />}
                    </div>
                    {chapter.subtitle && (
                      <span style={{ 
                        fontSize: '0.8rem', 
                        color: '#3A3028',
                        opacity: 0.6
                      }}>
                        {chapter.subtitle}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChapterMenu;
