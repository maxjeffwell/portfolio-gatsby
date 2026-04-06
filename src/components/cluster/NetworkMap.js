import React, { useState, useRef, useCallback } from 'react';
import { MapContainer, COLORS, ZONE_BOUNDS } from './networkStyles';
import NetworkNode from './NetworkNode';
import NetworkLink from './NetworkLink';
import NetworkTooltip from './NetworkTooltip';
import ParticleAnimation from './ParticleAnimation';
import useForceSimulation from '../../hooks/useForceSimulation';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

const ZONES = [
  { key: 'CLOUD', label: '\u2601 CLOUD', color: COLORS.cyan, ...ZONE_BOUNDS.CLOUD },
  {
    key: 'HOME_NETWORK',
    label: '\u2302 HOME NETWORK',
    color: COLORS.amber,
    ...ZONE_BOUNDS.HOME_NETWORK,
  },
  { key: 'STORAGE', label: '\u25C6 STORAGE', color: COLORS.green, ...ZONE_BOUNDS.STORAGE },
];

export default function NetworkMap({ topology, visibleLinkTypes, onNodeClick }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const nodes = topology?.nodes || [];
  const links = topology?.links || [];

  const positions = useForceSimulation(nodes, links, {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  });

  const posMap = {};
  for (const p of positions) {
    posMap[p.id] = p;
  }

  const filteredLinks = links.filter((l) => visibleLinkTypes.has(l.type));

  const handleHover = useCallback((node, event) => {
    setHoveredNode(node);
    if (node && event) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: event.clientX - rect.left + 12,
          y: event.clientY - rect.top - 10,
        });
      }
    }
  }, []);

  return (
    <MapContainer ref={containerRef}>
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Zone backgrounds and labels */}
        {ZONES.map((zone) => (
          <g key={zone.key}>
            <rect
              x={0}
              y={zone.yMin * MAP_HEIGHT}
              width={MAP_WIDTH}
              height={(zone.yMax - zone.yMin) * MAP_HEIGHT}
              fill={`${zone.color}05`}
            />
            <line
              x1={0}
              y1={zone.yMax * MAP_HEIGHT}
              x2={MAP_WIDTH}
              y2={zone.yMax * MAP_HEIGHT}
              stroke="rgba(255,255,255,0.05)"
            />
            <text
              x={12}
              y={zone.yMin * MAP_HEIGHT + 20}
              fill={zone.color}
              fontSize="12"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="1.5"
              opacity="0.3"
            >
              {zone.label}
            </text>
          </g>
        ))}

        {/* Links */}
        {filteredLinks.map((link, i) => (
          <NetworkLink
            key={`${link.source}-${link.target}-${link.type}-${i}`}
            link={link}
            sourcePos={posMap[link.source]}
            targetPos={posMap[link.target]}
          />
        ))}

        {/* Particles */}
        <ParticleAnimation links={filteredLinks} posMap={posMap} />

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = posMap[node.id];
          if (!pos) return null;
          return (
            <NetworkNode
              key={node.id}
              node={node}
              x={pos.x}
              y={pos.y}
              onHover={handleHover}
              onClick={onNodeClick}
            />
          );
        })}
      </svg>

      {hoveredNode && (
        <NetworkTooltip
          node={hoveredNode}
          x={tooltipPos.x}
          y={tooltipPos.y}
        />
      )}
    </MapContainer>
  );
}
