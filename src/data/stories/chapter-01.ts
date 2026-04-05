// Chapter 1 — The Routine
// Maya's life is grey and repetitive. Colors are muted. She moves through
// days like she's sleepwalking.

import { Chapter } from '../../types/story';

export const chapter01: Chapter = {
  id: 'ch01',
  title: 'The Routine',
  subtitle: 'Every day the same.',
  emotion: 'neutral',
  scenes: [
    {
      id: 'ch01_s01',
      type: 'panel_sequence',
      emotion: 'neutral',
      panels: [
        {
          id: 'p1', layout: 'full', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'environment', backgroundAsset: 'bedroom', narration: 'Monday. Again.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'protagonist', expression: 'sad', narration: '6:45 AM.' }],
        },
        {
          id: 'p3', layout: 'half_h', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'protagonist', expression: 'neutral', overlayText: '…five more minutes.' }],
        },
      ],
    },
    {
      id: 'ch01_s02',
      type: 'breathing',
      emotion: 'neutral',
      config: { cycles: 2 },
    },
    {
      id: 'ch01_s03',
      type: 'panel_sequence',
      emotion: 'neutral',
      panels: [
        {
          id: 'p1', layout: 'full', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'environment', backgroundAsset: 'city_street', narration: 'Same streets. Same faces.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'protagonist', expression: 'thoughtful', narration: 'She wonders if anyone else feels invisible.' }],
        },
      ],
    },
    {
      id: 'ch01_s04',
      type: 'matching',
      emotion: 'neutral',
      config: {
        pairs: [
          { left: '1248', right: '1248' },
          { left: '3361', right: '3361' },
          { left: '5500', right: '5500' },
        ],
      },
    },
    {
      id: 'ch01_s05',
      type: 'panel_sequence',
      emotion: 'neutral',
      panels: [
        {
          id: 'p1', layout: 'featured_top', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'environment', backgroundAsset: 'apartment', narration: 'Home. Finally.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'protagonist', expression: 'sad', narration: 'She eats alone. The TV murmurs.' }],
        },
        {
          id: 'p3', layout: 'half_h', emotion: 'neutral', tapToContinue: true,
          content: [{ id: 'c1', type: 'abstract', overlayText: 'Tomorrow will be the same.' }],
        },
      ],
    },
  ],
};
