import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { COLORS, healthColorFor } from './networkStyles';
import layoutDatabases, { connectedTo } from './databaseLayout';

export const RELATION_STYLES = {
  USES: { color: COLORS.cyan, label: 'App uses database' },
  PLACEMENT: { color: COLORS.amber, label: 'Runs on' },
  STORAGE: { color: COLORS.purple, label: 'Storage' },
  BACKUP: { color: COLORS.orange, label: 'Backup' },
};

const KIND_COLORS = {
  app: COLORS.cyan,
  database: COLORS.green,
  machine: COLORS.amber,
  storage: COLORS.purple,
  backup: COLORS.orange,
};

const ENGINE_LABELS = {
  POSTGRES: 'PG',
  MONGODB: 'MONGO',
  REDIS: 'REDIS',
  QDRANT: 'QDRANT',
  INFLUXDB: 'INFLUX',
  KAFKA: 'KAFKA',
  PROMETHEUS: 'PROM',
  FIRESTORE: 'FIRESTORE',
};
const COLUMN_TITLES = [
  { x: 16, text: 'APPLICATIONS' },
  { x: 420, text: 'DATABASES' },
];

const FONT = "'JetBrains Mono', 'Fira Code', monospace";

function edgeLook(edge) {
  const { color } = RELATION_STYLES[edge.relation];
  if (edge.relation === 'PLACEMENT') {
    return {
      color: edge.ready ? color : COLORS.red,
      width: edge.primary ? 2.4 : 1,
      dash: edge.primary ? undefined : '4 3',
    };
  }
  if (edge.relation === 'BACKUP') {
    if (edge.status === 'OFFLINE') return { color: COLORS.red, width: 2, dash: '6 3' };
    if (edge.status === 'UNKNOWN') return { color: COLORS.gray, width: 1, dash: '2 4' };
    return { color, width: 1.6 };
  }
  return { color, width: 1.4 };
}

// Faded when something else is in focus, strong when it is part of the focus.
function edgeOpacity(on, focused) {
  if (!on) return 0.05;
  return focused ? 0.95 : 0.45;
}

// A horizontal S-curve from the right edge of one box to the left edge of the next.
function curve(a, b) {
  const x1 = a.x + a.w;
  const y1 = a.y + a.h / 2;
  const x2 = b.x;
  const y2 = b.y + b.h / 2;
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

function InstanceDots({ database, x, y }) {
  return database.instances.map((inst, i) => (
    <circle
      key={inst.name}
      cx={x - i * 11}
      cy={y}
      r={inst.role === 'PRIMARY' ? 4 : 3}
      fill={inst.ready ? COLORS.green : COLORS.red}
      stroke={inst.role === 'PRIMARY' ? COLORS.text : 'none'}
      strokeWidth={1}
    />
  ));
}

export default function DatabaseMap({ topology, visibleRelations, selectedId, onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);
  const { width, height, nodes, edges } = useMemo(() => layoutDatabases(topology), [topology]);
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const shownEdges = edges.filter((e) => visibleRelations.has(e.relation));
  const focus = connectedTo(hoveredId || selectedId, shownEdges);
  const lit = (id) => !focus || focus.has(id);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', minWidth: 820, display: 'block', fontFamily: FONT }}
        role="img"
        aria-label="Applications, the databases they use, and what each database depends on"
      >
        {COLUMN_TITLES.map((t) => (
          <text key={t.text} x={t.x} y={24} fill={COLORS.muted} fontSize={11} letterSpacing={1.5}>
            {t.text}
          </text>
        ))}

        {shownEdges.map((edge) => {
          const a = nodeById.get(edge.source);
          const b = nodeById.get(edge.target);
          if (!a || !b) return null;
          const look = edgeLook(edge);
          const on = lit(edge.source) && lit(edge.target);
          return (
            <path
              key={`${edge.source}>${edge.target}>${edge.relation}`}
              d={curve(a, b)}
              fill="none"
              stroke={look.color}
              strokeWidth={look.width}
              strokeDasharray={look.dash}
              opacity={edgeOpacity(on, Boolean(focus))}
            />
          );
        })}

        {nodes.map((node) => {
          const color = KIND_COLORS[node.kind];
          const on = lit(node.id);
          const selected = node.id === selectedId;
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              opacity={on ? 1 : 0.2}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(node)}
            >
              {node.group && (
                <text x={0} y={-8} fill={COLORS.muted} fontSize={11} letterSpacing={1.5}>
                  {node.group}
                </text>
              )}
              <rect
                width={node.w}
                height={node.h}
                rx={6}
                fill={`${color}14`}
                stroke={color}
                strokeWidth={selected ? 2 : 1}
                strokeOpacity={selected ? 1 : 0.5}
              />
              {node.database && (
                <circle
                  cx={14}
                  cy={node.h / 2}
                  r={4}
                  fill={
                    node.database.storage === 'EXTERNAL'
                      ? COLORS.gray
                      : healthColorFor(node.database.health)
                  }
                />
              )}
              <text
                x={node.database ? 26 : 12}
                y={node.database ? 17 : node.h / 2 + 4}
                fill={color}
                fontSize={12}
                fontWeight={600}
              >
                {node.label}
              </text>
              {node.database && (
                <>
                  <text x={26} y={32} fill={COLORS.muted} fontSize={9.5}>
                    {ENGINE_LABELS[node.database.engine] || node.database.engine} &middot;{' '}
                    {node.database.manager}
                  </text>
                  <InstanceDots database={node.database} x={node.w - 12} y={14} />
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

DatabaseMap.propTypes = {
  topology: PropTypes.shape({}).isRequired,
  visibleRelations: PropTypes.instanceOf(Set).isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

DatabaseMap.defaultProps = { selectedId: null };
