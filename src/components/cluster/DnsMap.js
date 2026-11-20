import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, healthColorFor } from './networkStyles';
import { WIDTH, HEIGHT, ROWS, positionOf, hopPath } from './dnsLayout';

const FONT = "'JetBrains Mono', 'Fira Code', monospace";
const ROW_LABEL_Y = { 0: 34, 1: 132, 3: 328 };

// Fit text to a box; the full text is listed under the map.
const shorten = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

function Box({ box, title, subtitle, color, active, health, stat }) {
  return (
    <g transform={`translate(${box.x}, ${box.y})`} opacity={active ? 1 : 0.28}>
      <rect width={box.w} height={box.h} rx={6} fill={COLORS.mapBg} />
      <rect
        width={box.w}
        height={box.h}
        rx={6}
        fill={`${color}14`}
        stroke={color}
        strokeWidth={active ? 1.6 : 1}
        strokeOpacity={active ? 0.9 : 0.5}
      />
      {health && <circle cx={13} cy={17} r={4} fill={healthColorFor(health)} />}
      <text x={health ? 24 : 12} y={21} fill={color} fontSize={12.5} fontWeight={700}>
        {title}
      </text>
      <text x={12} y={37} fill={COLORS.text} fontSize={9.5} opacity={0.65}>
        {subtitle}
      </text>
      {stat && (
        <text x={12} y={50} fill={COLORS.muted} fontSize={8.5}>
          {shorten(stat, 34)}
        </text>
      )}
    </g>
  );
}

Box.propTypes = {
  box: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number,
  }).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  color: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  health: PropTypes.string,
  stat: PropTypes.string,
};

Box.defaultProps = { subtitle: '', health: null, stat: null };

export default function DnsMap({ resolvers, client, hops }) {
  const used = new Set(['client']);
  hops.forEach((hop) => {
    used.add(hop.from);
    used.add(hop.to);
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', minWidth: 780, display: 'block', fontFamily: FONT }}
        role="img"
        aria-label="The resolvers a DNS query passes through for the selected client and name"
      >
        <defs>
          <marker
            id="dns-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.cyan} />
          </marker>
          <marker
            id="dns-arrow-alt"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.gray} />
          </marker>
        </defs>

        {ROWS.map((row) => (
          <text
            key={row.label}
            x={232}
            y={ROW_LABEL_Y[row.row]}
            fill={COLORS.muted}
            fontSize={10}
            letterSpacing={1.5}
          >
            {row.label}
          </text>
        ))}

        {hops.map((hop) => {
          const a = positionOf(hop.from);
          const b = positionOf(hop.to);
          if (!a || !b) return null;
          const { d, mid } = hopPath(a, b);
          const color = hop.fallback ? COLORS.gray : COLORS.cyan;
          return (
            <g key={`${hop.from}>${hop.to}`}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={hop.fallback ? 1.3 : 2.2}
                strokeDasharray={hop.fallback ? '5 4' : undefined}
                markerEnd={`url(#${hop.fallback ? 'dns-arrow-alt' : 'dns-arrow'})`}
              />
              {hop.step && (
                <>
                  <circle cx={mid.x} cy={mid.y} r={9} fill={COLORS.bg} stroke={color} />
                  <text
                    x={mid.x}
                    y={mid.y + 3.5}
                    fill={color}
                    fontSize={10}
                    fontWeight={700}
                    textAnchor="middle"
                  >
                    {hop.step}
                  </text>
                </>
              )}
            </g>
          );
        })}

        <Box
          box={positionOf('client')}
          title="Who is asking"
          subtitle={shorten(client.displayName, 30)}
          color={COLORS.amber}
          active
        />
        {resolvers.map((r) => {
          const box = positionOf(r.id);
          if (!box) return null;
          return (
            <Box
              key={r.id}
              box={box}
              title={r.displayName}
              subtitle={shorten(r.location, 30)}
              color={r.location === 'Internet' ? COLORS.slate : COLORS.green}
              active={used.has(r.id)}
              health={r.health}
              stat={r.stat}
            />
          );
        })}
      </svg>
    </div>
  );
}

DnsMap.propTypes = {
  resolvers: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })).isRequired,
  client: PropTypes.shape({ displayName: PropTypes.string }).isRequired,
  hops: PropTypes.arrayOf(PropTypes.shape({ from: PropTypes.string, to: PropTypes.string }))
    .isRequired,
};
