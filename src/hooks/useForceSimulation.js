import { useState, useEffect, useRef } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
} from 'd3-force';
import { ZONE_BOUNDS } from '../components/cluster/networkStyles';

export default function useForceSimulation(nodes, links, { width, height }) {
  const [positions, setPositions] = useState([]);
  const simRef = useRef(null);

  useEffect(() => {
    if (!nodes?.length || !width || !height) return;

    const simNodes = nodes.map((n) => ({
      ...n,
      x: n.x ?? width * (0.3 + Math.random() * 0.4),
      y:
        n.y ??
        height *
          ((ZONE_BOUNDS[n.zone]?.yMin ?? 0.3) + Math.random() * 0.2),
    }));

    const simLinks = links
      .filter((l) => l.type === 'WIREGUARD')
      .map((l) => ({
        source: l.source,
        target: l.target,
      }));

    const sim = forceSimulation(simNodes)
      .force(
        'link',
        forceLink(simLinks)
          .id((d) => d.id)
          .distance(150)
          .strength(0.3),
      )
      .force('charge', forceManyBody().strength(-300))
      .force('collide', forceCollide(80))
      .force('x', forceX(width / 2).strength(0.05))
      .force('zoneY', (alpha) => {
        for (const node of simNodes) {
          const bounds = ZONE_BOUNDS[node.zone];
          if (!bounds) continue;
          const yMin = bounds.yMin * height;
          const yMax = bounds.yMax * height;
          const mid = (yMin + yMax) / 2;

          node.vy += (mid - node.y) * alpha * 0.3;

          if (node.y < yMin) node.y = yMin;
          if (node.y > yMax) node.y = yMax;
        }
      })
      .on('tick', () => {
        for (const node of simNodes) {
          node.x = Math.max(80, Math.min(width - 80, node.x));
        }
        setPositions(simNodes.map((n) => ({ id: n.id, x: n.x, y: n.y })));
      });

    sim.alpha(1).restart();
    simRef.current = sim;

    return () => {
      sim.stop();
    };
  }, [nodes, links, width, height]);

  return positions;
}
