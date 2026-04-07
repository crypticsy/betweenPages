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
          content: [{ id: 'c1', type: 'environment', backgroundAsset: 'ch3_s1_p1', narration: 'He texted. She said yes. The coffee shop smelled of cinnamon and warm bread.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'romantic', tapToContinue: true,
          content: [{ id: 'c2', type: 'environment', backgroundAsset: 'ch3_s1_p2', narration: 'She lifted her cup, letting the warmth seep into her hands, and took a careful sip.' }],
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
            template: 'I didn\'t even mean to ____ coffee. I just ____ something to do with my hands.',
            answers: ['get', 'needed'],
            distractors: ['make', 'found', 'kept', 'left'],
            speaker: 'protagonist',
            expression: 'embarrassed',
          },
          {
            template: 'That\'s okay. I\'m ____ the same. I never know what to ____ on first dates.',
            answers: ['kind of', 'do'],
            distractors: ['dog', 'smirk', 'laugh', 'pull'],
            speaker: 'love_interest',
            expression: 'thoughtful',
          },
          {
            template: 'Really? You don\'t seem ____.',
            answers: ['nervous'],
            distractors: ['coffee', 'cute', 'sleepy', 'cityscapper'],
            speaker: 'protagonist',
            expression: 'surprised',
          },
          {
            template: 'That\'s just because you make it feel ____.',
            answers: ['easy'],
            distractors: ['hard', 'slow', 'strange', 'difficult'],
            speaker: 'love_interest',
            expression: 'embarrassed',
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
            { id: 'c1', type: 'character', character: 'protagonist', expression: 'happy', narration: 'The hours slipped by, filled with quiet laughter and shared stories.' },
            { id: 'c2', type: 'character', character: 'love_interest', expression: 'happy', narration: 'Two hours felt like minutes. They barely noticed the world outside.' },
          ],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'romantic', tapToContinue: true,
          content: [
            { id: 'c1', type: 'character', character: 'love_interest', expression: 'longing', overlayText: 'I hope we can do this again soon.' },
          ],
        },
        {
          id: 'p3', layout: 'half_h', emotion: 'romantic', tapToContinue: true,
          content: [
            { id: 'c1', type: 'character', character: 'protagonist', expression: 'happy', overlayText: 'Yes, I’d like that.' },
          ],
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
