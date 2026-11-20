// Layout for the monitoring map: one column per stage, left to right, in the
// order data moves. Pure: the same topology always gives the same positions.

export const WIDTH = 1240;
export const BOX = { w: 204, h: 60 };
const TOP = 46;
const BOTTOM = 16;
const PITCH = 78;
const SIDE = 10;

export function layoutMonitoring(topology) {
  const stages = topology?.stages ?? [];
  const nodes = topology?.nodes ?? [];
  const flows = topology?.flows ?? [];

  const byStage = stages.map((stage) => nodes.filter((n) => n.stage === stage.id));
  const rows = Math.max(1, ...byStage.map((list) => list.length));
  const height = TOP + rows * PITCH - (PITCH - BOX.h) + BOTTOM;
  const gap = stages.length > 1 ? (WIDTH - 2 * SIDE - BOX.w) / (stages.length - 1) : 0;

  const boxes = [];
  const columns = stages.map((stage, col) => ({
    id: stage.id,
    label: stage.label,
    x: SIDE + col * gap,
  }));
  byStage.forEach((list, col) => {
    // Short columns are centred against the tallest one.
    const offset = ((rows - list.length) * PITCH) / 2;
    list.forEach((node, row) => {
      boxes.push({ ...node, x: SIDE + col * gap, y: TOP + offset + row * PITCH, ...BOX });
    });
  });

  // Several signals between the same two boxes are drawn as parallel lines.
  const groups = new Map();
  flows.forEach((flow) => {
    const key = `${flow.from}>${flow.to}`;
    groups.set(key, [...(groups.get(key) || []), flow]);
  });
  const edges = flows.map((flow) => {
    const group = groups.get(`${flow.from}>${flow.to}`);
    return { ...flow, lane: group.indexOf(flow) - (group.length - 1) / 2 };
  });

  return { width: WIDTH, height, columns, boxes, edges };
}

const LANE_GAP = 9;

// A curve from one box to another. Boxes in different columns are joined
// side to side; boxes in the same column top to bottom, bowing outward so the
// line clears any box between them.
export function flowPath(a, b, lane = 0) {
  const shift = lane * LANE_GAP;
  if (Math.abs(a.x - b.x) < 1) {
    const down = b.y > a.y;
    const x = a.x + a.w - 34 + shift;
    const y1 = down ? a.y + a.h : a.y;
    const y2 = down ? b.y : b.y + b.h;
    const bow = 30;
    return `M ${x} ${y1} C ${x + bow} ${y1}, ${x + bow} ${y2}, ${x} ${y2}`;
  }
  const x1 = a.x + a.w;
  const x2 = b.x;
  const y1 = a.y + a.h / 2 + shift;
  const y2 = b.y + b.h / 2 + shift;
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

// Everything upstream and downstream of a node along the given flows: where
// its data comes from and everywhere it ends up. Returns null for no focus.
//
// `relays` are nodes that pass each signal through unchanged (the collectors):
// metrics that enter one leave as metrics, so a trace must not light up the
// log path just because both pass through the same collector. Every other
// node turns what it receives into something else (a store answers queries,
// a rule raises alerts), so all of its flows count.
export function lineage(id, flows, relays = new Set()) {
  if (!id) return null;
  const nodes = new Set([id]);
  const used = new Set();
  const walk = (forward) => {
    const seen = new Set();
    const queue = [{ node: id, signal: null }];
    while (queue.length) {
      const { node, signal } = queue.shift();
      flows.forEach((flow, i) => {
        const [near, far] = forward ? [flow.from, flow.to] : [flow.to, flow.from];
        if (near !== node) return;
        if (signal && relays.has(node) && flow.signal !== signal) return;
        used.add(i);
        nodes.add(far);
        const key = `${far}|${flow.signal}`;
        if (!seen.has(key)) {
          seen.add(key);
          queue.push({ node: far, signal: flow.signal });
        }
      });
    }
  };
  walk(true);
  walk(false);
  return { nodes, flows: used };
}
