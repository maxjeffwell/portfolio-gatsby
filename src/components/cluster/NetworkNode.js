import React from 'react';
import { NODE_COLORS, COLORS, healthColorFor } from './networkStyles';

const NODE_WIDTH = 160;
const NODE_HEIGHT = 70;
const BADGE_HEIGHT = 14;
const BADGE_SLOTS = 3;
const BADGE_WIDTH = 44;

export default function NetworkNode({ node, x, y, onHover, onClick }) {
  const color = NODE_COLORS[node.type] || COLORS.cyan;
  const healthColor = healthColorFor(node.health);

  // Three badge slots fit inside the node. With more services than slots,
  // the last slot becomes a "+N" counter; the detail panel lists them all.
  const services = node.services || [];
  const badges =
    services.length > BADGE_SLOTS
      ? [...services.slice(0, BADGE_SLOTS - 1), { name: `+${services.length - (BADGE_SLOTS - 1)}` }]
      : services;
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
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
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
        <g
          key={svc.name}
          transform={`translate(${12 + i * (BADGE_WIDTH + 2)}, ${NODE_HEIGHT - 14})`}
        >
          <rect
            width={BADGE_WIDTH}
            height={BADGE_HEIGHT}
            rx={3}
            fill={`${color}26`}
            stroke={`${color}33`}
            strokeWidth={1}
          />
          <text
            x={BADGE_WIDTH / 2}
            y={10}
            fill={color}
            fontSize="8"
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="0.3"
          >
            {svc.name.length > 7 ? `${svc.name.substring(0, 6)}\u2026` : svc.name}
          </text>
        </g>
      ))}
    </g>
  );
}
