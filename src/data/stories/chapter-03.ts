// Chapter 3 — Coffee
// First date. Conversation flows easier — fewer blanks, warmer tone.
// Warm pinks and oranges fill the palette.

import { Chapter } from '../../types/story';

export const chapter03: Chapter = {
  id: 'ch03',
  title: 'Coffee',
  subtitle: 'Getting to know someone.',
  emotion: 'romantic',
  scenes: [
    {
      id: 'ch03_s01',
      type: 'panel_sequence',
      emotion: 'romantic',
      panels: [
        {
          id: 'p1', layout: 'full', emotion: 'romantic', tapToContinue: true,
          content: [{ id: 'c1', type: 'environment', backgroundAsset: 'coffee_shop', narration: 'He texted. She said yes.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'romantic', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'protagonist', expression: 'embarrassed', narration: 'She checked the mirror three times.' }],
        },
      ],
    },
    // Easier conversation — fewer blanks, fewer distractors
    {
      id: 'ch03_s02',
      type: 'conversation_puzzle',
      emotion: 'romantic',
      config: {
        sentences: [
          {
            template: 'I ____ coffee when I\'m ____.',
            answers: ['love', 'nervous'],
            distractors: ['hate', 'need', 'happy', 'tired'],
          },
          {
            template: 'You make everything feel ____.',
            answers: ['easy'],
            distractors: ['hard', 'strange', 'quiet', 'lighter'],
          },
        ],
      },
    },
    {
      id: 'ch03_s03',
      type: 'panel_sequence',
      emotion: 'romantic',
      panels: [
        {
          id: 'p1', layout: 'full', emotion: 'romantic', tapToContinue: true,
          content: [
            { id: 'c1', type: 'character', character: 'protagonist', expression: 'happy' },
            { id: 'c2', type: 'character', character: 'love_interest', expression: 'happy', narration: 'Two hours. They barely noticed.' },
          ],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'romantic', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'love_interest', expression: 'longing', overlayText: 'Same time next week?' }],
        },
        {
          id: 'p3', layout: 'half_h', emotion: 'romantic', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'protagonist', expression: 'happy', overlayText: 'Yes.' }],
        },
      ],
    },
    {
      id: 'ch03_s04',
      type: 'polaroid',
      emotion: 'romantic',
      config: {
        imagePairs: [
          { label: 'First Date — the coffee shop', caption: 'Two hours felt like twenty minutes.' },
        ],
      },
    },
  ],
};
