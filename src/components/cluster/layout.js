// Deterministic layout for the network map: the same nodes always get the
// same positions, so the map does not move when fresh data arrives.
//
// Zones are stacked bands. Each band is as tall as the rows it holds, so a
// node can never spill out of its zone. Inside a zone, nodes of one type share
// rows, and neighbouring rows (across zones too) are shifted against each
// other like bricks, so nodes do not line up in columns that links would have
// to run through.

export const NODE_WIDTH = 160;
export const NODE_HEIGHT = 92;

const ZONE_ORDER = ['CLOUD', 'HOME_NETWORK', 'STORAGE'];
// Within a zone: network gear first, then machines, then logical services.
const TYPE_ORDER = ['ROUTER', 'K8S_NODE', 'NAS', 'REPLICATED_STORAGE', 'OFFSITE_BACKUP'];

const MAX_PER_ROW = 4;
const ROW_PITCH = 132;
const ZONE_PAD_TOP = 34;
const ZONE_PAD_BOTTOM = 18;
const ZONE_GAP = 14;
const SIDE_PAD = 20;

function typeRank(type) {
  const rank = TYPE_ORDER.indexOf(type);
  return rank === -1 ? TYPE_ORDER.length : rank;
}

// Rows for one zone: each node type starts its own row, and a type with more
// nodes than fit is split into balanced rows.
function rowsFor(zoneNodes) {
  const byType = new Map();
  [...zoneNodes]
    .sort((a, b) => typeRank(a.type) - typeRank(b.type))
    .forEach((node) => {
      const key = typeRank(node.type);
      byType.set(key, [...(byType.get(key) || []), node]);
    });

  const groups = [...byType.values()];
  // Small zones read better as one line than as one row per type.
  if (zoneNodes.length <= MAX_PER_ROW) return [groups.flat()];

  const rows = [];
  groups.forEach((group) => {
    const rowCount = Math.ceil(group.length / MAX_PER_ROW);
    const perRow = Math.ceil(group.length / rowCount);
    for (let i = 0; i < group.length; i += perRow) rows.push(group.slice(i, i + perRow));
  });
  return rows;
}

// X positions for a row. Rows that would otherwise sit in the same columns as
// a neighbour are laid out as bricks: both use a slightly narrower slot, and
// every other one starts half a slot further right.
function rowXs(count, brick, width) {
  const inner = width - 2 * SIDE_PAD;
  if (brick === 'none') {
    const slot = inner / count;
    return Array.from({ length: count }, (_, i) => SIDE_PAD + slot * (i + 0.5));
  }
  const slot = inner / (count + 0.5);
  const start = brick === 'right' ? 1 : 0.5;
  return Array.from({ length: count }, (_, i) => SIDE_PAD + slot * (i + start));
}

// 'none' for a row that is centred, 'left' / 'right' for the two halves of a
// brick pattern. Neighbouring rows clash when their sizes have the same parity.
function brickPattern(rows) {
  const pattern = rows.map(() => 'none');
  for (let i = 1; i < rows.length; i += 1) {
    if ((rows[i - 1].length - rows[i].length) % 2 === 0) {
      if (pattern[i - 1] === 'none') pattern[i - 1] = 'left';
      pattern[i] = pattern[i - 1] === 'left' ? 'right' : 'left';
    }
  }
  return pattern;
}

export default function layoutNodes(nodes, { width }) {
  const byZone = {};
  (nodes || []).forEach((node) => {
    if (ZONE_ORDER.includes(node.zone)) {
      (byZone[node.zone] = byZone[node.zone] || []).push(node);
    }
  });

  const zoneRows = ZONE_ORDER.filter((zone) => byZone[zone]).map((zone) => ({
    zone,
    rows: rowsFor(byZone[zone]),
  }));
  // One pattern over every row on the map, so the last row of a zone and the
  // first row of the next are staggered as well.
  const pattern = brickPattern(zoneRows.flatMap((z) => z.rows));

  const positions = [];
  const zones = [];
  let y = ZONE_GAP;
  let rowNumber = 0;

  zoneRows.forEach(({ zone, rows }) => {
    const height =
      ZONE_PAD_TOP + rows.length * ROW_PITCH - (ROW_PITCH - NODE_HEIGHT) + ZONE_PAD_BOTTOM;
    zones.push({ key: zone, y, height });

    rows.forEach((row, rowIndex) => {
      const xs = rowXs(row.length, pattern[rowNumber], width);
      row.forEach((node, i) => {
        positions.push({
          id: node.id,
          x: xs[i],
          y: y + ZONE_PAD_TOP + rowIndex * ROW_PITCH + NODE_HEIGHT / 2,
        });
      });
      rowNumber += 1;
    });

    y += height + ZONE_GAP;
  });

  return { positions, zones, height: y };
}

// Links between the same two nodes would lie on top of each other. Each gets
// a `bend`: 0 for a single link, otherwise offsets spread around 0.
export function assignBends(links) {
  const groups = new Map();
  links.forEach((link) => {
    const key = [link.source, link.target].sort().join('|');
    groups.set(key, [...(groups.get(key) || []), link]);
  });
  const bends = new Map();
  groups.forEach((group) => {
    group.forEach((link, i) => bends.set(link, i - (group.length - 1) / 2));
  });
  return bends;
}

const BEND_STEP = 22;
// Every link bows slightly, so links that share a direction do not merge into
// one line; parallel links between the same pair bow by different amounts.
const BASE_BOW = 0.06;

export function linkPath(source, target, bend = 0) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.hypot(dx, dy) || 1;
  const offset = length * BASE_BOW + bend * BEND_STEP;
  const cx = (source.x + target.x) / 2 + (-dy / length) * offset;
  const cy = (source.y + target.y) / 2 + (dx / length) * offset;
  return `M${source.x},${source.y} Q${cx},${cy} ${target.x},${target.y}`;
}
