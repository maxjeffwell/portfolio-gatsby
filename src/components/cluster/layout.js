import { ZONE_BOUNDS } from './networkStyles';

const MAX_PER_ROW = 4;
const ROW_PITCH = 125;
// Alternate nodes sit slightly lower so links between non-adjacent nodes in
// the same row are not hidden behind the node between them.
const STAGGER = 22;

function splitIntoRows(items) {
  const rowCount = Math.ceil(items.length / MAX_PER_ROW);
  const perRow = Math.ceil(items.length / rowCount);
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow));
  }
  return rows;
}

/**
 * Places nodes in evenly spaced rows inside their zone's band.
 * Deterministic: the same nodes always get the same positions, so the map
 * does not move when fresh data arrives.
 */
export default function layoutNodes(nodes, { width, height }) {
  const byZone = {};
  for (const node of nodes || []) {
    if (ZONE_BOUNDS[node.zone]) {
      (byZone[node.zone] = byZone[node.zone] || []).push(node);
    }
  }

  const positions = [];
  for (const [zone, zoneNodes] of Object.entries(byZone)) {
    const { yMin, yMax } = ZONE_BOUNDS[zone];
    const rows = splitIntoRows(zoneNodes);
    const bandMid = ((yMin + yMax) / 2) * height;
    const firstRowY = bandMid - ((rows.length - 1) * ROW_PITCH) / 2 - STAGGER / 2;

    rows.forEach((row, rowIndex) => {
      const slot = width / row.length;
      row.forEach((node, i) => {
        positions.push({
          id: node.id,
          x: slot * (i + 0.5),
          y: firstRowY + rowIndex * ROW_PITCH + (i % 2 === 1 ? STAGGER : 0),
        });
      });
    });
  }
  return positions;
}
