import {
  layoutMonitoring,
  flowPath,
  lineage,
  wrapText,
  WIDTH,
  BOX_WIDTH,
} from '../monitoringLayout';

const topology = {
  stages: [
    { id: 'SOURCE', label: 'Sources' },
    { id: 'COLLECT', label: 'Collectors' },
    { id: 'STORE', label: 'Stores' },
  ],
  nodes: [
    { id: 'apps', stage: 'SOURCE' },
    { id: 'hosts', stage: 'SOURCE' },
    { id: 'probe', stage: 'SOURCE' },
    { id: 'alloy', stage: 'COLLECT' },
    { id: 'mimir', stage: 'STORE' },
    { id: 'loki', stage: 'STORE' },
    { id: 'garage', stage: 'STORE' },
  ],
  flows: [
    { from: 'apps', to: 'alloy', signal: 'LOGS' },
    { from: 'apps', to: 'alloy', signal: 'PROFILES' },
    { from: 'hosts', to: 'alloy', signal: 'METRICS' },
    { from: 'alloy', to: 'mimir', signal: 'METRICS' },
    { from: 'alloy', to: 'loki', signal: 'LOGS' },
    { from: 'mimir', to: 'garage', signal: 'STORAGE' },
  ],
};

describe('layoutMonitoring', () => {
  const { boxes, columns, edges, height } = layoutMonitoring(topology);
  const box = (id) => boxes.find((b) => b.id === id);

  it('gives each stage a column, in order, inside the canvas', () => {
    expect(columns.map((c) => c.id)).toEqual(['SOURCE', 'COLLECT', 'STORE']);
    expect(box('apps').x).toBeLessThan(box('alloy').x);
    expect(box('alloy').x).toBeLessThan(box('mimir').x);
    boxes.forEach((b) => {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w).toBeLessThanOrEqual(WIDTH);
      expect(b.y + b.h).toBeLessThanOrEqual(height);
    });
  });

  it('never overlaps boxes in a column and centres a short column', () => {
    const sources = ['apps', 'hosts', 'probe'].map(box);
    for (let i = 1; i < sources.length; i += 1) {
      expect(sources[i].y).toBeGreaterThanOrEqual(sources[i - 1].y + sources[i - 1].h);
    }
    expect(box('alloy').y).toBe(box('hosts').y);
  });

  it('puts two signals between the same boxes in separate lanes', () => {
    const pair = edges.filter((e) => e.from === 'apps' && e.to === 'alloy');
    expect(pair.map((e) => e.lane)).toEqual([-0.5, 0.5]);
    expect(edges.find((e) => e.from === 'hosts').lane).toBe(0);
    expect(flowPath(box('apps'), box('alloy'), -0.5)).not.toEqual(
      flowPath(box('apps'), box('alloy'), 0.5)
    );
  });

  it('joins boxes in one column top to bottom', () => {
    const d = flowPath(box('mimir'), box('garage'));
    expect(
      d.startsWith(`M ${box('mimir').x + box('mimir').w - 34} ${box('mimir').y + box('mimir').h}`)
    ).toBe(true);
  });

  it('tolerates no data', () => {
    expect(layoutMonitoring(null).boxes).toEqual([]);
  });
});

describe('lineage', () => {
  const { flows } = topology;

  it('follows a store back to its sources and on to what stores it', () => {
    const { nodes } = lineage('mimir', flows);
    expect([...nodes].sort()).toEqual(['alloy', 'apps', 'garage', 'hosts', 'mimir'].sort());
  });

  it('follows a source forward to everywhere its data ends up', () => {
    const { nodes, flows: used } = lineage('hosts', flows);
    expect(nodes.has('loki')).toBe(true);
    expect(nodes.has('apps')).toBe(false);
    expect(used.has(2)).toBe(true);
    expect(used.has(0)).toBe(false);
  });

  it('respects the flows it is given, and returns null without a focus', () => {
    const metricsOnly = flows.filter((f) => f.signal === 'METRICS');
    expect(lineage('hosts', metricsOnly).nodes.has('loki')).toBe(false);
    expect(lineage(null, flows)).toBeNull();
  });

  it('does not cross from one signal to another inside a collector', () => {
    const relays = new Set(['alloy']);
    // Host metrics pass through Alloy as metrics: they reach Mimir, not Loki.
    const fromHosts = lineage('hosts', flows, relays).nodes;
    expect(fromHosts.has('mimir')).toBe(true);
    expect(fromHosts.has('garage')).toBe(true);
    expect(fromHosts.has('loki')).toBe(false);

    // Loki's data came in as logs: from the apps, not from the hosts' metrics.
    const intoLoki = lineage('loki', flows, relays).nodes;
    expect(intoLoki.has('apps')).toBe(true);
    expect(intoLoki.has('hosts')).toBe(false);

    // Selecting the collector itself shows everything it handles.
    expect(lineage('alloy', flows, relays).nodes.size).toBe(6);
  });
});

describe('wrapText', () => {
  it('leaves text that fits on one line', () => {
    expect(wrapText('Prometheus', 22)).toEqual(['Prometheus']);
  });

  it('breaks between words, never inside one that fits', () => {
    expect(wrapText('Routers, NAS units, UPS, Garage, WireGuard', 30)).toEqual([
      'Routers, NAS units, UPS,',
      'Garage, WireGuard',
    ]);
  });

  it('splits a single word that is longer than a line', () => {
    expect(wrapText('kube-state-metrics-and-more', 12)).toEqual(['kube-state-m', 'etrics-and-…']);
  });

  it('ends the last line with an ellipsis only when the text still does not fit', () => {
    const lines = wrapText('one two three four five six seven eight nine ten', 10, 2);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith('…')).toBe(true);
    lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(10));
  });

  it('returns nothing for no text', () => {
    expect(wrapText(undefined, 20)).toEqual([]);
    expect(wrapText('', 20)).toEqual([]);
  });
});

describe('box sizing', () => {
  const sized = layoutMonitoring({
    stages: [
      { id: 'SOURCE', label: 'Sources' },
      { id: 'STORE', label: 'Stores' },
    ],
    nodes: [
      {
        id: 'gear',
        stage: 'SOURCE',
        displayName: 'Network & storage gear',
        location: 'Routers, NAS units, UPS, Garage, WireGuard',
        stat: '9/9 targets up',
        health: 'HEALTHY',
      },
      { id: 'hosts', stage: 'SOURCE', displayName: 'Hosts', location: 'Seven nodes' },
      {
        id: 'net',
        stage: 'SOURCE',
        displayName: 'IntervalAI neural network',
        location: 'KServe + OpenVINO · GPU Worker 2',
        stat: '19 requests in 7 days',
        health: 'HEALTHY',
      },
      {
        id: 'prom',
        stage: 'STORE',
        displayName: 'Prometheus',
        location: 'In the cluster, 15 days',
        stat: '1/1 running · 206/206 targets up · 14k samples/s · 588k series',
        health: 'HEALTHY',
      },
    ],
    flows: [],
  });
  const box = (id) => sized.boxes.find((b) => b.id === id);
  const lastBaseline = (b) =>
    Math.max(
      ...[...b.text.title, ...b.text.location, ...(b.text.stat ? [b.text.stat] : [])].map(
        (l) => l.y
      )
    );

  it('shows a long description in full on two lines instead of cutting it off', () => {
    expect(box('gear').text.location.map((l) => l.text)).toEqual([
      'Routers, NAS units, UPS,',
      'Garage, WireGuard',
    ]);
    expect(box('gear').text.title.map((l) => l.text)).toEqual(['Network & storage gear']);
  });

  it('wraps a title that is too long for one line', () => {
    expect(
      box('net')
        .text.title.map((l) => l.text)
        .join(' ')
    ).toBe('IntervalAI neural network');
    expect(box('net').text.title.length).toBe(2);
  });

  it('makes a box as tall as its text needs, and no taller', () => {
    expect(box('gear').h).toBeGreaterThan(box('hosts').h);
    expect(box('net').h).toBeGreaterThan(box('hosts').h);
    sized.boxes.forEach((b) => {
      expect(lastBaseline(b)).toBeLessThan(b.h);
      expect(b.h - lastBaseline(b)).toBeLessThanOrEqual(12);
      expect(b.w).toBe(BOX_WIDTH);
    });
  });

  it('keeps every line inside the box width', () => {
    // JetBrains Mono advances 0.6 em per character.
    const fits = (line, size, x) => x + line.text.length * size * 0.6 <= BOX_WIDTH - 6;
    sized.boxes.forEach((b) => {
      b.text.title.forEach((l) => expect(fits(l, 13.5, l.x)).toBe(true));
      b.text.location.forEach((l) => expect(fits(l, 10.5, l.x)).toBe(true));
      if (b.text.stat) expect(fits(b.text.stat, 10, b.text.stat.x)).toBe(true);
    });
  });

  it('shows only the first figure of a long statistic', () => {
    expect(box('prom').text.stat.text).toBe('1/1 running');
  });

  it('stacks boxes of different heights without overlap, inside the canvas', () => {
    const sources = ['gear', 'hosts', 'net'].map(box);
    for (let i = 1; i < sources.length; i += 1) {
      expect(sources[i].y).toBeGreaterThan(sources[i - 1].y + sources[i - 1].h);
    }
    sized.boxes.forEach((b) => expect(b.y + b.h).toBeLessThanOrEqual(sized.height));
  });
});
