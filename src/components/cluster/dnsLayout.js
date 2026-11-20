// Fixed positions for the DNS map. The resolvers are few and their roles are
// stable, so they are placed by hand: who asks on the left, the internet on
// the right, one row per place a resolver lives.

export const WIDTH = 1080;
export const HEIGHT = 500;
export const BOX = { w: 196, h: 70 };

const COLUMN_X = [12, 226, 440, 654, 872];
const ROW_Y = [44, 156, 268, 392];

// Labels sit just above the first row of each group.
export const ROWS = [
  { label: 'CLUSTER', y: ROW_Y[0] - 12 },
  { label: 'HOME LAN', y: ROW_Y[1] - 12 },
  { label: 'TAILNET AND INTERNET', y: ROW_Y[3] - 12 },
];
export const ROW_LABEL_X = COLUMN_X[1];

// [column, row]; a fractional row sits between two rows.
const GRID = {
  client: [0, 1.5],
  'node-local': [1, 0],
  coredns: [2, 0],
  'kube-api': [3, 0],
  'router-dnsmasq': [2, 1],
  'router-unbound': [3, 1],
  blocky: [1, 2],
  'mesh-unbound': [2, 2],
  tailscale: [1, 3],
  cloudflare: [2, 3],
  provider: [3, 3],
  authoritative: [4, 1.5],
};

function rowY(row) {
  const low = Math.floor(row);
  const high = Math.ceil(row);
  return ROW_Y[low] + (ROW_Y[high] - ROW_Y[low]) * (row - low);
}

export function positionOf(id) {
  const cell = GRID[id];
  if (!cell) return null;
  return { x: COLUMN_X[cell[0]], y: rowY(cell[1]), ...BOX };
}

// A curve between two boxes that leaves and enters on the sides facing each
// other. Boxes in the same column are joined top-to-bottom with a sideways bow
// so the line does not hide behind a box between them.
export function hopPath(a, b) {
  const sameColumn = Math.abs(a.x - b.x) < 1;
  if (sameColumn) {
    const down = b.y > a.y;
    const x = a.x + a.w / 2;
    const y1 = down ? a.y + a.h : a.y;
    const y2 = down ? b.y : b.y + b.h;
    const bow = 52;
    return {
      d: `M ${x} ${y1} C ${x + bow} ${y1}, ${x + bow} ${y2}, ${x} ${y2}`,
      mid: { x: x + bow * 0.75, y: (y1 + y2) / 2 },
    };
  }
  const forward = b.x > a.x;
  const x1 = forward ? a.x + a.w : a.x;
  const x2 = forward ? b.x : b.x + b.w;
  const y1 = a.y + a.h / 2;
  const y2 = b.y + b.h / 2;
  const mx = (x1 + x2) / 2;
  return {
    d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
    mid: { x: mx, y: (y1 + y2) / 2 },
  };
}

// Numbers the hops of a path: the main route counts 1, 2, 3 in order;
// alternates are not numbered.
export function numberHops(hops) {
  let n = 0;
  return (hops || []).map((hop) => {
    if (hop.fallback) return { ...hop, step: null };
    n += 1;
    return { ...hop, step: n };
  });
}

// The resolvers of a path in the order the main route visits them, for a
// compact one-line view on screens too narrow for the map.
export function mainRoute(hops) {
  const route = ['client'];
  (hops || []).forEach((hop) => {
    if (!hop.fallback && !route.includes(hop.to)) route.push(hop.to);
  });
  return route;
}

// "7/7 nodes · 58 queries/s · 88% from cache" -> "7/7 nodes · 58 q/s": what
// fits inside a box. The full figure is listed under the map.
export function shortStat(stat) {
  if (!stat) return null;
  return stat.split(' \u00b7 ').slice(0, 2).join(' \u00b7 ').replace('queries/s', 'q/s');
}
