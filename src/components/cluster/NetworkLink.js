import React from 'react';
import { LINK_STYLES } from './networkStyles';

export default function NetworkLink({ link, sourcePos, targetPos }) {
  const style = LINK_STYLES[link.type] || LINK_STYLES.WIREGUARD;
  const opacity = link.status === 'HEALTHY' ? 0.4 : 0.15;

  if (!sourcePos || !targetPos) return null;

  return (
    <line
      x1={sourcePos.x}
      y1={sourcePos.y}
      x2={targetPos.x}
      y2={targetPos.y}
      stroke={style.color}
      strokeWidth={style.width}
      strokeDasharray={style.dashArray || undefined}
      opacity={opacity}
    />
  );
}
