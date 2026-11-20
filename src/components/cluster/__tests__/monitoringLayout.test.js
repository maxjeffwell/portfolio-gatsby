import { layoutMonitoring, flowPath, lineage, WIDTH } from '../monitoringLayout';

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
