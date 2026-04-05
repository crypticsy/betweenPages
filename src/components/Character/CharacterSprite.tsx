// ─── Character Sprite ─────────────────────────────────────────────────────────

import { CharacterExpression } from '../../types/story';
import girlImg from '../../assets/characters/girl.png';
import boyImg  from '../../assets/characters/boy.png';

// Subtle CSS filter/transform tweaks per expression
function expressionStyle(expression: CharacterExpression): React.CSSProperties {
  switch (expression) {
    case 'sad':
    case 'crying':
      return { filter: 'brightness(0.88) saturate(0.7)' };
    case 'happy':
    case 'laughing':
      return { filter: 'brightness(1.05) saturate(1.15)' };
    case 'embarrassed':
      return { filter: 'brightness(1.02) sepia(0.15)' };
    case 'surprised':
      return { transform: 'scale(1.04)' };
    case 'determined':
      return { filter: 'contrast(1.08)' };
    case 'thoughtful':
      return { filter: 'brightness(0.95) saturate(0.9)' };
    default:
      return {};
  }
}

interface Props {
  characterId: string;
  expression: CharacterExpression;
  size?: number;
  flip?: boolean;
}

export default function CharacterSprite({
  characterId,
  expression,
  size = 100,
  flip = false,
}: Props) {
  const imgSrc = characterId === 'love_interest' ? boyImg : girlImg;
  const exprStyle = expressionStyle(expression);

  return (
    <img
      src={imgSrc}
      alt={characterId}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        transform: [flip ? 'scaleX(-1)' : '', exprStyle.transform ?? ''].filter(Boolean).join(' ') || undefined,
        filter: exprStyle.filter,
        transition: 'filter 0.4s ease, transform 0.4s ease',
      }}
    />
  );
}
