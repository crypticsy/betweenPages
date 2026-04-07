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
          content: [{ id: 'c1', type: 'environment', backgroundAsset: 'park', narration: 'She takes a different route. Just this once.' }],
        },
        {
          id: 'p2', layout: 'half_h', emotion: 'hopeful', tapToContinue: true,
          content: [{ id: 'c1', type: 'abstract', overlayText: '♪  ♩  ♫', narration: 'Music. From somewhere.' }],
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
            template: 'Oh — I didn\'t mean to ____. I\'m just ____ here every day.',
            answers: ['interrupt', 'playing'],
            distractors: ['music', 'sorry', 'bright', 'home'],
          },
          {
            template: 'You have such a ____ voice. Does it come ____?',
            answers: ['beautiful', 'naturally'],
            distractors: ['sing', 'forget', 'arrive', 'stay'],
          },
          {
            template: 'I\'ve never really ____ to anyone about ____.',
            answers: ['talked', 'music'],
            distractors: ['slowly', 'bright', 'tired', 'here'],
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
            { id: 'c1', type: 'character', character: 'protagonist', expression: 'embarrassed' },
            { id: 'c2', type: 'character', character: 'love_interest', expression: 'laughing', narration: 'For a moment, the grey lifts.' },
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
          { label: 'First Meeting — the park', caption: 'The day the colour came back.' },
        ],
      },
    },
  ],
};
