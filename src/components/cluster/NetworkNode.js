import React from 'react';
import { NODE_COLORS, COLORS, healthColorFor } from './networkStyles';
import { NODE_WIDTH, NODE_HEIGHT as BOX_HEIGHT } from './layout';

// Height of the title area; the service badges sit below it.
const NODE_HEIGHT = 70;
const BADGE_HEIGHT = 14;
const BADGE_SLOTS = 3;
const BADGE_WIDTH = 44;
// The title starts after the health dot; a name longer than fits at full
// width is squeezed into the box instead of running out of it.
const TITLE_X = 22;
const TITLE_MAX_WIDTH = NODE_WIDTH - TITLE_X - 8;
const TITLE_CHARS_THAT_FIT = 17;

// `layerStyle`: line style of the optional layer this device belongs to (the
// second network). Its box is outlined in that style, so it reads as part of
// the other network and not as one more homelab router or switch.
export default function NetworkNode({ node, x, y, dimmed, layerStyle, onHover, onClick }) {
  const color = NODE_COLORS[node.type] || COLORS.cyan;
  const healthColor = healthColorFor(node.health);

  // Three badge slots fit inside the node. With more services than slots,
  // the last slot becomes a "+N" counter; the detail panel lists them all.
  const services = node.services || [];
  const badges =
    services.length > BADGE_SLOTS
      ? [...services.slice(0, BADGE_SLOTS - 1), { name: `+${services.length - (BADGE_SLOTS - 1)}` }]
      : services;

  return (
    <g
      transform={`translate(${x - NODE_WIDTH / 2}, ${y - BOX_HEIGHT / 2})`}
      style={{ cursor: 'pointer' }}
      opacity={dimmed ? 0.3 : 1}
      onMouseEnter={(e) => onHover?.(node, e)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(node)}
    >
      {/* Solid backing so links pass behind the node instead of through its text. */}
      <rect width={NODE_WIDTH} height={BOX_HEIGHT} rx={6} fill={COLORS.mapBg} />
      <rect
        width={NODE_WIDTH}
        height={BOX_HEIGHT}
        rx={6}
        fill={`${color}14`}
        stroke={layerStyle ? layerStyle.color : `${color}4D`}
        strokeWidth={layerStyle ? 1.5 : 1}
        strokeDasharray={layerStyle?.dashArray || undefined}
      />

      <circle cx={12} cy={16} r={4} fill={healthColor}>
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>

      <text
        x={TITLE_X}
        y={20}
        fill={color}
        fontSize="13"
        fontWeight="700"
        fontFamily="'JetBrains Mono', monospace"
        {...(node.displayName.length > TITLE_CHARS_THAT_FIT && {
          textLength: TITLE_MAX_WIDTH,
          lengthAdjust: 'spacingAndGlyphs',
        })}
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
