// Layout for the monitoring map: one column per stage, left to right, in the
// order data moves. Pure: the same topology always gives the same positions.
//
// A box is as tall as its text needs. Names and descriptions wrap onto a
// second line instead of being cut off, so the height varies from box to box
// and each column is stacked from the heights of its own boxes.

export const WIDTH = 1240;
export const BOX_WIDTH = 216;
const TOP = 46;
const BOTTOM = 16;
const BOX_GAP = 16;
const SIDE = 10;

// Text metrics. The map is set in JetBrains Mono, which advances 0.6 em per
// character, so how much fits on a line can be worked out without measuring.
const ADVANCE = 0.6;
const PAD_LEFT = 12;
const PAD_RIGHT = 8;
const DOT_INDENT = 26; // a title with a health dot starts after the dot
const TITLE = { size: 13.5, first: 24, line: 16 };
const LOCATION = { size: 10.5, lead: 17, line: 13 };
const STAT = { size: 10, lead: 13 };
const PAD_BOTTOM = 9;
const EMPTY_HEIGHT = 44;

const charsThatFit = (x, size) =>
  Math.max(4, Math.floor((BOX_WIDTH - x - PAD_RIGHT) / (size * ADVANCE)));

// Breaks text into lines of at most `maxChars`, between words where it can.
// A word longer than a line is split. Text that still does not fit in
// `maxLines` ends with an ellipsis in place of its last character.
export function wrapText(text, maxChars, maxLines = 2) {
  if (!text) return [];
  const lines = [];
  let line = '';
  const push = () => {
    if (line) lines.push(line);
    line = '';
  };
  String(text)
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word) => {
      let rest = word;
      if (line && `${line} ${rest}`.length > maxChars) push();
      while (rest.length > maxChars) {
        if (line) push();
        lines.push(rest.slice(0, maxChars));
        rest = rest.slice(maxChars);
      }
      line = line ? `${line} ${rest}` : rest;
    });
  push();

  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  const last = kept[maxLines - 1];
  kept[maxLines - 1] = `${last.slice(0, Math.max(0, maxChars - 1)).trimEnd()}…`;
  return kept;
}

// Where each line of a box's text sits, and how tall that makes the box.
// Only the first figure of a statistic is shown; the rest is in the panel.
function boxText(node) {
  const titleX = node.health ? DOT_INDENT : PAD_LEFT;
  const title = wrapText(node.displayName, charsThatFit(titleX, TITLE.size)).map((text, i) => ({
    text,
    x: titleX,
    y: TITLE.first + i * TITLE.line,
  }));
  let y = title.length ? title[title.length - 1].y : TITLE.first - TITLE.line;

  const location = wrapText(node.location, charsThatFit(PAD_LEFT, LOCATION.size)).map(
    (text, i) => ({ text, x: PAD_LEFT, y: y + LOCATION.lead + i * LOCATION.line })
  );
  if (location.length) y = location[location.length - 1].y;

  let stat = null;
  const figure = node.stat ? node.stat.split(' · ')[0] : null;
  if (figure) {
    y += STAT.lead;
    stat = { text: wrapText(figure, charsThatFit(PAD_LEFT, STAT.size), 1)[0], x: PAD_LEFT, y };
  }

  const hasText = title.length || location.length || stat;
  return { text: { title, location, stat }, h: hasText ? y + PAD_BOTTOM : EMPTY_HEIGHT };
}

export function layoutMonitoring(topology) {
  const stages = topology?.stages ?? [];
  const nodes = topology?.nodes ?? [];
  const flows = topology?.flows ?? [];

  const byStage = stages.map((stage) =>
    nodes.filter((n) => n.stage === stage.id).map((node) => ({ node, ...boxText(node) }))
  );
  const columnHeight = (list) =>
    list.reduce((sum, item) => sum + item.h, 0) + Math.max(0, list.length - 1) * BOX_GAP;
  const tallest = Math.max(EMPTY_HEIGHT, ...byStage.map(columnHeight));
  const height = TOP + tallest + BOTTOM;
  const gap = stages.length > 1 ? (WIDTH - 2 * SIDE - BOX_WIDTH) / (stages.length - 1) : 0;

  const boxes = [];
  const columns = stages.map((stage, col) => ({
    id: stage.id,
    label: stage.label,
    x: SIDE + col * gap,
  }));
  byStage.forEach((list, col) => {
    // Short columns are centred against the tallest one.
    let y = TOP + (tallest - columnHeight(list)) / 2;
    list.forEach(({ node, text, h }) => {
      boxes.push({ ...node, x: SIDE + col * gap, y, w: BOX_WIDTH, h, text });
      y += h + BOX_GAP;
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
