import React from 'react';
import { LINK_STYLES } from './networkStyles';
import { linkPath } from './layout';
import { planParticles } from './traffic';

// Moving dots are measured traffic: a link gets them only when the gateway
// reports a rate for it, and they move faster and in greater number as the
// rate grows. A link with no dot is idle or is not measured.
export default function ParticleAnimation({ links, posMap, bends }) {
  const plans = planParticles(links.filter((l) => posMap[l.source] && posMap[l.target]));

  return (
    <g>
      {plans.map(({ link, count, durationS }) => {
        const style = LINK_STYLES[link.type];
        const path = linkPath(posMap[link.source], posMap[link.target], bends?.get(link) ?? 0);
        const key = `particle-${link.source}-${link.target}-${link.type}`;

        return Array.from({ length: count }, (_, n) => (
          <circle key={`${key}-${n}`} r={2} fill={style?.color || '#00f0ff'} opacity={0.8}>
            <animateMotion
              dur={`${durationS}s`}
              begin={`${-(durationS / count) * n}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        ));
      })}
    </g>
  );
}
