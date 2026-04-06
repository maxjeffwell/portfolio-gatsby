import React from 'react';
import { LINK_STYLES } from './networkStyles';

export default function ParticleAnimation({ links, posMap }) {
  const animatedLinks = links
    .filter(
      (l) =>
        l.status === 'HEALTHY' && posMap[l.source] && posMap[l.target],
    )
    .slice(0, 8);

  return (
    <g>
      {animatedLinks.map((link, i) => {
        const src = posMap[link.source];
        const tgt = posMap[link.target];
        if (!src || !tgt) return null;

        const style = LINK_STYLES[link.type];
        const dur = 3 + (i % 3);
        const path = `M${src.x},${src.y} L${tgt.x},${tgt.y}`;

        return (
          <circle
            key={`particle-${link.source}-${link.target}-${link.type}-${i}`}
            r={2}
            fill={style?.color || '#00f0ff'}
            opacity={0.8}
          >
            <animateMotion
              dur={`${dur}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        );
      })}
    </g>
  );
}
