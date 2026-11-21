import React, { useState, useRef, useCallback, useMemo } from 'react';
import { MapContainer, COLORS, LINK_STYLES } from './networkStyles';
import NetworkNode from './NetworkNode';
import NetworkLink from './NetworkLink';
import NetworkTooltip from './NetworkTooltip';
import ParticleAnimation from './ParticleAnimation';
import layoutNodes, { assignBends, visibleTopology } from './layout';

const MAP_WIDTH = 1000;
// Wider than this and the map only gets taller, not clearer.
const MAP_MAX_WIDTH_PX = 1150;
const MAP_MIN_WIDTH_PX = 720;

const ZONE_STYLES = {
  CLOUD: { label: '\u2601 CLOUD', color: COLORS.cyan },
  HOME_NETWORK: { label: '\u2302 HOME NETWORK', color: COLORS.amber },
  STORAGE: { label: '\u25C6 STORAGE', color: COLORS.green },
};

export default function NetworkMap({ topology, visibleLinkTypes, onNodeClick }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Devices of a layer that is switched off are left out before layout, so the
  // map closes up instead of showing gaps.
  const {
    nodes,
    links: filteredLinks,
    layerOf,
  } = visibleTopology(
    topology?.nodes || [],
    topology?.links || [],
    visibleLinkTypes,
    Object.keys(LINK_STYLES)
  );

  // Positions depend only on which nodes exist, not on each data refresh.
  const layoutKey = nodes.map((n) => `${n.id}:${n.zone}:${n.type}`).join('|');
  const { positions, zones, height } = useMemo(
    () => layoutNodes(nodes, { width: MAP_WIDTH }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutKey]
  );

  const posMap = {};
  for (const p of positions) {
    posMap[p.id] = p;
  }

  const bends = assignBends(filteredLinks);

  // Hovering a node brings its links and neighbours forward and fades the rest.
  const focusId = hoveredNode?.id ?? null;
  const neighbours = new Set(focusId ? [focusId] : []);
  if (focusId) {
    filteredLinks.forEach((l) => {
      if (l.source === focusId) neighbours.add(l.target);
      if (l.target === focusId) neighbours.add(l.source);
    });
  }
  const emphasisOf = (link) => {
    if (!focusId) return 'normal';
    return link.source === focusId || link.target === focusId ? 'focus' : 'dim';
  };

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
      {/* On narrow screens the map keeps a readable size and scrolls sideways. */}
      <div style={{ overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${height}`}
          width="100%"
          style={{
            display: 'block',
            minWidth: MAP_MIN_WIDTH_PX,
            maxWidth: MAP_MAX_WIDTH_PX,
            margin: '0 auto',
          }}
        >
          {/* Zone backgrounds and labels */}
          {zones.map((zone) => {
            const style = ZONE_STYLES[zone.key];
            return (
              <g key={zone.key}>
                <rect
                  x={8}
                  y={zone.y}
                  width={MAP_WIDTH - 16}
                  height={zone.height}
                  rx={8}
                  fill={`${style.color}08`}
                  stroke={`${style.color}26`}
                />
                <text
                  x={22}
                  y={zone.y + 21}
                  fill={style.color}
                  fontSize="12"
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="1.5"
                  opacity="0.55"
                >
                  {style.label}
                </text>
              </g>
            );
          })}

          {/* Links */}
          {filteredLinks.map((link, i) => (
            <NetworkLink
              key={`${link.source}-${link.target}-${link.type}-${i}`}
              link={link}
              sourcePos={posMap[link.source]}
              targetPos={posMap[link.target]}
              bend={bends.get(link)}
              emphasis={emphasisOf(link)}
            />
          ))}

          {/* Particles */}
          <ParticleAnimation links={filteredLinks} posMap={posMap} bends={bends} />

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
                layerStyle={LINK_STYLES[layerOf[node.id]]}
                dimmed={Boolean(focusId) && !neighbours.has(node.id)}
                onHover={handleHover}
                onClick={onNodeClick}
              />
            );
          })}
        </svg>
      </div>

      {hoveredNode && <NetworkTooltip node={hoveredNode} x={tooltipPos.x} y={tooltipPos.y} />}
    </MapContainer>
  );
}
