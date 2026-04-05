import { Story } from '../../types/story';
import { chapter01 } from './chapter-01';
import { chapter02 } from './chapter-02';
import { chapter03 } from './chapter-03';

export const MAIN_STORY: Story = {
  id: 'maya_and_eli',
  title: 'Maya & Eli',
  chapters: [chapter01, chapter02, chapter03],
  characters: {
    protagonist:   { id: 'protagonist',   name: 'Maya', color: '#E8937A' },
    love_interest: { id: 'love_interest', name: 'Eli',  color: '#7A9BE8' },
  },
};
