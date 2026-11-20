import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, healthColorFor } from './networkStyles';
import { WIDTH, HEIGHT, ROWS, ROW_LABEL_X, positionOf, hopPath, shortStat } from './dnsLayout';

const FONT = "'JetBrains Mono', 'Fira Code', monospace";

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
      {health && <circle cx={15} cy={21} r={4.5} fill={healthColorFor(health)} />}
      <text x={health ? 27 : 12} y={26} fill={color} fontSize={13.5} fontWeight={700}>
        {title}
      </text>
      <text x={12} y={44} fill={COLORS.text} fontSize={11} opacity={0.7}>
        {subtitle}
      </text>
      {stat && (
        <text x={12} y={60} fill={COLORS.text} fontSize={10.5} opacity={0.45}>
          {shortStat(stat)}
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

export default function DnsMap({ resolvers, client, hops, unresolved }) {
  const used = new Set(['client']);
  hops.forEach((hop) => {
    used.add(hop.from);
    used.add(hop.to);
  });

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', display: 'block', fontFamily: FONT }}
        role="img"
        aria-label="The resolvers a DNS query passes through for the selected client and name"
      >
        <defs>
          <marker
            id="dns-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.cyan} />
          </marker>
          <marker
            id="dns-arrow-alt"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.gray} />
          </marker>
        </defs>

        {ROWS.map((row) => (
          <text
            key={row.label}
            x={ROW_LABEL_X}
            y={row.y}
            fill={COLORS.text}
            opacity={0.45}
            fontSize={11}
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
                  <circle
                    cx={mid.x}
                    cy={mid.y}
                    r={11}
                    fill={COLORS.bg}
                    stroke={color}
                    strokeWidth={1.5}
                  />
                  <text
                    x={mid.x}
                    y={mid.y + 4}
                    fill={color}
                    fontSize={12}
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

        {unresolved && (
          <g>
            <path
              d={`M ${positionOf('client').x + positionOf('client').w} ${
                positionOf('client').y + positionOf('client').h / 2
              } h 34`}
              stroke={COLORS.red}
              strokeWidth={2.2}
              strokeDasharray="5 4"
            />
            <text
              x={positionOf('client').x + positionOf('client').w + 44}
              y={positionOf('client').y + positionOf('client').h / 2 + 5}
              fill={COLORS.red}
              fontSize={15}
              fontWeight={700}
            >
              {'\u2715 no route'}
            </text>
          </g>
        )}

        <Box
          box={positionOf('client')}
          title="Who is asking"
          subtitle={shorten(client.displayName, 26)}
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
              subtitle={shorten(r.location, 26)}
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
  unresolved: PropTypes.bool,
};

DnsMap.defaultProps = { unresolved: false };
