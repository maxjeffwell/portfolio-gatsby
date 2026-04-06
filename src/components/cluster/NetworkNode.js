import React from 'react';
import { NODE_COLORS, COLORS } from './networkStyles';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 70;
const BADGE_HEIGHT = 14;

export default function NetworkNode({ node, x, y, onHover, onClick }) {
  const color = NODE_COLORS[node.type] || COLORS.cyan;
  const healthColor =
    node.health === 'HEALTHY'
      ? COLORS.green
      : node.health === 'DEGRADED'
        ? COLORS.amber
        : COLORS.red;

  const badges = node.services?.slice(0, 4) || [];
  const totalHeight = NODE_HEIGHT + (badges.length > 0 ? BADGE_HEIGHT + 8 : 0);

  return (
    <g
      transform={`translate(${x - NODE_WIDTH / 2}, ${y - NODE_HEIGHT / 2})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={(e) => onHover?.(node, e)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(node)}
    >
      <rect
        width={NODE_WIDTH}
        height={totalHeight}
        rx={6}
        fill={`${color}14`}
        stroke={`${color}4D`}
        strokeWidth={1}
      />

      <circle cx={12} cy={16} r={4} fill={healthColor}>
        <animate
          attributeName="opacity"
          values="1;0.4;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      <text
        x={22}
        y={20}
        fill={color}
        fontSize="13"
        fontWeight="700"
        fontFamily="'JetBrains Mono', monospace"
      >
        {node.displayName}
      </text>

      {node.wireguardIp && (
        <text
          x={12}
          y={38}
          fill={COLORS.text}
          fontSize="11"
          opacity="0.5"
          fontFamily="'JetBrains Mono', monospace"
        >
          {node.wireguardIp}
        </text>
      )}

      {badges.map((svc, i) => (
        <g key={svc.name} transform={`translate(${12 + i * 52}, ${NODE_HEIGHT - 14})`}>
          <rect
            width={48}
            height={BADGE_HEIGHT}
            rx={3}
            fill={`${color}26`}
            stroke={`${color}33`}
            strokeWidth={1}
          />
          <text
            x={24}
            y={10}
            fill={color}
            fontSize="8"
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.3"
          >
            {svc.name.length > 7 ? svc.name.substring(0, 7) : svc.name}
          </text>
        </g>
      ))}
    </g>
  );
}
