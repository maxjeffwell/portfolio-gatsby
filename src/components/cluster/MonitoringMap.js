import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { COLORS, healthColorFor } from './networkStyles';
import { layoutMonitoring, flowPath, lineage } from './monitoringLayout';

export const SIGNAL_STYLES = {
  METRICS: { color: COLORS.cyan, label: 'Metrics' },
  LOGS: { color: COLORS.amber, label: 'Logs' },
  TRACES: { color: COLORS.pink, label: 'Traces' },
  PROFILES: { color: COLORS.purple, label: 'Profiles' },
  ALERTS: { color: COLORS.red, label: 'Alerts' },
  QUERY: { color: COLORS.green, label: 'Queries' },
  STORAGE: { color: COLORS.slate, label: 'Storage' },
};

const STAGE_COLORS = {
  SOURCE: COLORS.slate,
  COLLECT: COLORS.cyan,
  STORE: COLORS.green,
  USE: COLORS.amber,
  NOTIFY: COLORS.red,
};

const FONT = "'JetBrains Mono', 'Fira Code', monospace";
const shorten = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);
// Only what fits in a box; the full figure is in the detail panel.
const shortStat = (stat) => (stat ? shorten(stat.split(' · ')[0], 28) : null);

// Also draws the LLM map, which has the same shape (stages, boxes, typed
// flows) with its own colour key.
export default function MonitoringMap({
  topology,
  visibleSignals,
  selectedId,
  onSelect,
  signalStyles,
  stageColors,
  relayStage,
  ariaLabel,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const { width, height, columns, boxes, edges } = useMemo(
    () => layoutMonitoring(topology),
    [topology]
  );
  const boxById = useMemo(() => new Map(boxes.map((b) => [b.id, b])), [boxes]);

  const shown = edges.filter((e) => visibleSignals.has(e.signal));
  // Collectors relay each signal unchanged; see lineage().
  const relays = useMemo(
    () => new Set(boxes.filter((b) => b.stage === relayStage).map((b) => b.id)),
    [boxes, relayStage]
  );
  const focus = lineage(hoveredId || selectedId, shown, relays);
  const nodeOn = (id) => !focus || focus.nodes.has(id);
  const edgeOn = (i) => !focus || focus.flows.has(i);
  // With a signal filter on, boxes that carry none of the chosen signals fade.
  const carries = new Set(shown.flatMap((e) => [e.from, e.to]));

  return (
    <div style={{ overflowX: 'auto' }}>
      <style>{`
        @keyframes monitoring-flow { to { stroke-dashoffset: -24; } }
        .monitoring-flow { stroke-dasharray: 3 9; animation: monitoring-flow 1.1s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .monitoring-flow { animation: none; } }
      `}</style>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', minWidth: 900, display: 'block', fontFamily: FONT }}
        role="img"
        aria-label={ariaLabel}
      >
        {columns.map((col) => (
          <text
            key={col.id}
            x={col.x}
            y={22}
            fill={stageColors[col.id] || COLORS.text}
            opacity={0.75}
            fontSize={12}
            letterSpacing={1.5}
          >
            {col.label.toUpperCase()}
          </text>
        ))}

        {shown.map((edge, i) => {
          const a = boxById.get(edge.from);
          const b = boxById.get(edge.to);
          if (!a || !b) return null;
          const { color } = signalStyles[edge.signal] || { color: COLORS.gray };
          const on = edgeOn(i);
          const d = flowPath(a, b, edge.lane);
          const key = `${edge.from}>${edge.to}>${edge.signal}`;
          return (
            <g key={key} opacity={on ? 1 : 0.06}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={1.4}
                opacity={focus ? 0.5 : 0.28}
              />
              {/* Moving dashes show which way the data travels. */}
              <path
                className="monitoring-flow"
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={focus && on ? 2.6 : 1.8}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {boxes.map((box) => {
          const color = stageColors[box.stage] || COLORS.text;
          const on = nodeOn(box.id) && carries.has(box.id);
          const selected = box.id === selectedId;
          return (
            <g
              key={box.id}
              transform={`translate(${box.x}, ${box.y})`}
              opacity={on ? 1 : 0.22}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredId(box.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(box.id)}
            >
              <rect width={box.w} height={box.h} rx={6} fill={COLORS.mapBg} />
              <rect
                width={box.w}
                height={box.h}
                rx={6}
                fill={`${color}14`}
                stroke={color}
                strokeWidth={selected ? 2.2 : 1}
                strokeOpacity={selected ? 1 : 0.55}
              />
              {box.health && (
                <circle
                  cx={14}
                  cy={19}
                  r={4.5}
                  fill={healthColorFor(box.health)}
                  stroke={box.inferred ? COLORS.mapBg : 'none'}
                  strokeWidth={box.inferred ? 2 : 0}
                />
              )}
              <text x={box.health ? 26 : 12} y={24} fill={color} fontSize={13.5} fontWeight={700}>
                {shorten(box.displayName, 22)}
              </text>
              <text x={12} y={41} fill={COLORS.text} fontSize={10.5} opacity={0.65}>
                {shorten(box.location, 30)}
              </text>
              {box.stat && (
                <text x={12} y={54} fill={COLORS.text} fontSize={10} opacity={0.45}>
                  {shortStat(box.stat)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

MonitoringMap.propTypes = {
  topology: PropTypes.shape({}).isRequired,
  visibleSignals: PropTypes.instanceOf(Set).isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  signalStyles: PropTypes.objectOf(PropTypes.shape({ color: PropTypes.string })),
  stageColors: PropTypes.objectOf(PropTypes.string),
  relayStage: PropTypes.string,
  ariaLabel: PropTypes.string,
};

MonitoringMap.defaultProps = {
  selectedId: null,
  signalStyles: SIGNAL_STYLES,
  stageColors: STAGE_COLORS,
  relayStage: 'COLLECT',
  ariaLabel:
    'Telemetry flowing from sources through collectors into stores, then to dashboards and alerting',
};
