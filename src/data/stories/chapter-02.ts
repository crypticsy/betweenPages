// Chapter 2 — Yellow
// Maya hears music in the park and meets Eli. Color floods back.

import { Chapter } from '../../types/story';

export const chapter02: Chapter = {
  id: 'ch02',
  title: 'Yellow',
  subtitle: 'Something is different today.',
  emotion: 'hopeful',
  scenes: [
    {
      id: 'ch02_s01',
      type: 'panel_sequence',
      emotion: 'hopeful',
      panels: [
        {
          id: 'p1', layout: 'full', emotion: 'hopeful', tapToContinue: true,
          content: [{ id: 'c1', type: 'environment', backgroundAsset: 'ch2_s1_p1', narration: 'She takes a different route. Just this once.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'hopeful', tapToContinue: true,
          content: [{ id: 'c2', type: 'environment', backgroundAsset: 'ch2_s1_p2'}],
        },
      ],
    },
    // First meeting — harder fill-in-the-blank (more distractors)
    {
      id: 'ch02_s02',
      type: 'conversation_puzzle',
      emotion: 'hopeful',
      config: {
        sentences: [
          {
            template: 'Oh — sorry, I didn\'t mean to ____. I just ____ here sometimes.',
            answers: ['interrupt', 'play'],
            distractors: ['listen', 'stay', 'hide', 'wait'],
            speaker: 'love_interest',
            expression: 'happy',
          },
          {
            template: 'No, it\'s okay. You sound really ____. Did you ever ____?',
            answers: ['good', 'train'],
            distractors: ['quiet', 'stop', 'leave', 'try'],
            speaker: 'protagonist',
            expression: 'embarrassed',
          },
          {
            template: 'Not really. I don\'t usually ____ where people can ____.',
            answers: ['play', 'hear'],
            distractors: ['talk', 'stay', 'voice', 'sleep'],
            speaker: 'love_interest',
            expression: 'thoughtful',
          },
        ],
      },
    },
    {
      id: 'ch02_s03',
      type: 'panel_sequence',
      emotion: 'excited',
      panels: [
        {
          id: 'p1', layout: 'half_h', emotion: 'excited', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'protagonist', expression: 'surprised', narration: 'Her name comes out fine. Somehow.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'excited', tapToContinue: true,
          content: [{ id: 'c1', type: 'character', character: 'love_interest', expression: 'happy', overlayText: "I'm Eli.", narration: 'He smiles easily.' }],
        },
        {
          id: 'p3', layout: 'full', emotion: 'excited', tapToContinue: true,
          content: [
            { id: 'c1', type: 'character', character: 'protagonist', expression: 'embarrassed', narration: 'For a moment, the grey lifts.'  },
            { id: 'c2', type: 'character', character: 'love_interest', expression: 'laughing', narration: 'He laughs at her embarrassment.' },
          ],
        },
      ],
    },
    {
      id: 'ch02_s04',
      type: 'polaroid',
      emotion: 'excited',
      config: {
        imagePairs: [
          { label: 'First Meeting — the park', caption: 'The day the colour came back.', assetKey: 'ch02_s04' },
        ],
      },
    },
  ],
};
