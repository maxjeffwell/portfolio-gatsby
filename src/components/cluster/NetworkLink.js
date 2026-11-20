import React from 'react';
import { LINK_STYLES, DEFAULT_LINK_STYLE } from './networkStyles';
import { linkPath } from './layout';

// `emphasis` is 'normal', 'focus' (touches the hovered node) or 'dim'.
const OPACITY = { normal: 0.45, focus: 0.95, dim: 0.06 };

export default function NetworkLink({ link, sourcePos, targetPos, bend, emphasis }) {
  const style = LINK_STYLES[link.type] || DEFAULT_LINK_STYLE;
  const healthy = link.status === 'HEALTHY';

  if (!sourcePos || !targetPos) return null;

  return (
    <path
      d={linkPath(sourcePos, targetPos, bend)}
      fill="none"
      stroke={style.color}
      strokeWidth={emphasis === 'focus' ? style.width + 0.8 : style.width}
      strokeDasharray={style.dashArray || undefined}
      opacity={OPACITY[emphasis] * (healthy ? 1 : 0.4)}
    />
  );
}
