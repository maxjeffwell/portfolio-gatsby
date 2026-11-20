// Fixed positions for the DNS map. The resolvers are few and their roles are
// stable, so they are placed by hand: who asks on the left, the internet on
// the right, one row per place a resolver lives.

export const WIDTH = 1080;
export const HEIGHT = 440;
export const BOX = { w: 184, h: 58 };

const COLUMN_X = [16, 232, 448, 664, 880];
const ROW_Y = [46, 144, 242, 340];

export const ROWS = [
  { label: 'CLUSTER', row: 0 },
  { label: 'HOME LAN', row: 1 },
  { label: 'TAILNET AND INTERNET', row: 3 },
];

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
    const bow = 46;
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
