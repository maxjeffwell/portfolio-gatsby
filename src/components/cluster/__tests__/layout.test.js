import layoutNodes, {
  assignBends,
  linkPath,
  visibleTopology,
  NODE_WIDTH,
  NODE_HEIGHT,
} from '../layout';

const SIZE = { width: 1000 };

const node = (id, zone, type = 'K8S_NODE') => ({ id, zone, type });
const home = (n, type) =>
  Array.from({ length: n }, (_, i) => node(`${type}${i}`, 'HOME_NETWORK', type));

// The real map: 2 cloud, 2 routers + 6 machines at home, 3 storage.
const REAL = [
  node('edge', 'CLOUD'),
  node('b2', 'CLOUD', 'OFFSITE_BACKUP'),
  ...home(6, 'K8S_NODE'),
  ...home(2, 'ROUTER'),
  node('nas1', 'STORAGE', 'NAS'),
  node('nas2', 'STORAGE', 'NAS'),
  node('vol', 'STORAGE', 'REPLICATED_STORAGE'),
];

describe('layoutNodes', () => {
  it('returns the same positions for the same nodes', () => {
    expect(layoutNodes(REAL, SIZE)).toEqual(layoutNodes(REAL, SIZE));
  });

  it('keeps every node box fully inside its zone band and the map', () => {
    const { positions, zones, height } = layoutNodes(REAL, SIZE);
    const zoneOf = Object.fromEntries(REAL.map((n) => [n.id, n.zone]));

    expect(positions).toHaveLength(REAL.length);
    positions.forEach((p) => {
      const zone = zones.find((z) => z.key === zoneOf[p.id]);
      expect(p.y - NODE_HEIGHT / 2).toBeGreaterThanOrEqual(zone.y);
      expect(p.y + NODE_HEIGHT / 2).toBeLessThanOrEqual(zone.y + zone.height);
      expect(p.x - NODE_WIDTH / 2).toBeGreaterThanOrEqual(0);
      expect(p.x + NODE_WIDTH / 2).toBeLessThanOrEqual(SIZE.width);
    });
    zones.forEach((z) => expect(z.y + z.height).toBeLessThanOrEqual(height));
  });

  it('never overlaps two node boxes', () => {
    const { positions } = layoutNodes(REAL, SIZE);
    positions.forEach((a, i) => {
      positions.slice(i + 1).forEach((b) => {
        const apart = Math.abs(a.x - b.x) >= NODE_WIDTH || Math.abs(a.y - b.y) >= NODE_HEIGHT;
        expect(apart).toBe(true);
      });
    });
  });

  it('does not stack neighbouring rows in the same columns', () => {
    const { positions } = layoutNodes(home(8, 'K8S_NODE'), SIZE);
    const rows = {};
    positions.forEach((p) => {
      (rows[p.y] = rows[p.y] || []).push(p.x);
    });
    const [first, second] = Object.values(rows);
    first.forEach((x) => second.forEach((x2) => expect(Math.abs(x - x2)).toBeGreaterThan(40)));
  });

  it('puts routers above machines and keeps a type together', () => {
    const { positions } = layoutNodes(REAL, SIZE);
    const y = (id) => positions.find((p) => p.id === id).y;
    expect(y('ROUTER0')).toBe(y('ROUTER1'));
    expect(y('ROUTER0')).toBeLessThan(y('K8S_NODE0'));
  });

  it('skips nodes in unknown zones and tolerates no nodes', () => {
    expect(layoutNodes([node('x', 'MARS')], SIZE).positions).toEqual([]);
    expect(layoutNodes(undefined, SIZE).positions).toEqual([]);
  });
});

describe('link geometry', () => {
  it('spreads links between the same pair, whatever their direction', () => {
    const links = [
      { source: 'a', target: 'b', type: 'X' },
      { source: 'b', target: 'a', type: 'Y' },
      { source: 'a', target: 'b', type: 'Z' },
      { source: 'a', target: 'c', type: 'X' },
    ];
    const bends = assignBends(links);
    expect(links.slice(0, 3).map((l) => bends.get(l))).toEqual([-1, 0, 1]);
    expect(bends.get(links[3])).toBe(0);
  });

  it('draws different curves for different bends and keeps the endpoints', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 100, y: 0 };
    expect(linkPath(a, b, 0)).not.toEqual(linkPath(a, b, 1));
    expect(linkPath(a, b, 1)).toMatch(/^M0,0 Q.* 100,0$/);
  });
});

describe('visibleTopology', () => {
  const nodes = [
    'router',
    'switch',
    'machine',
    'second-router',
    'second-switch',
    'ap',
    'volumes',
  ].map((id) => ({ id }));
  const link = (source, target, type) => ({ source, target, type });
  const links = [
    link('machine', 'switch', 'ETHERNET'),
    link('switch', 'router', 'MOCA'),
    link('machine', 'volumes', 'NVME_OF'),
    link('machine', 'second-switch', 'SECOND_NETWORK'),
    link('second-switch', 'second-router', 'SECOND_NETWORK'),
    link('second-switch', 'ap', 'SECOND_NETWORK'),
    // The access point is also a tailnet member.
    link('machine', 'ap', 'TAILSCALE'),
  ];
  const known = ['ETHERNET', 'MOCA', 'NVME_OF', 'SECOND_NETWORK', 'TAILSCALE'];
  const ids = (list) => list.map((n) => n.id);
  const show = (...types) => visibleTopology(nodes, links, new Set(types), known);

  it('shows everything when every link type is on', () => {
    const out = show(...known);
    expect(ids(out.nodes)).toEqual(ids(nodes));
    expect(out.links).toHaveLength(links.length);
  });

  it('hides devices cabled only into the second network when that layer is off', () => {
    const out = show('ETHERNET', 'MOCA', 'NVME_OF', 'TAILSCALE');
    expect(ids(out.nodes)).toEqual(['router', 'switch', 'machine', 'volumes']);
    // A machine with a leg on both networks stays; only that leg goes.
    expect(out.links.map((l) => l.type)).toEqual(['ETHERNET', 'MOCA', 'NVME_OF']);
  });

  it('drops links that would point at a hidden device, whatever their type', () => {
    const out = show('ETHERNET', 'MOCA', 'NVME_OF', 'TAILSCALE');
    expect(out.links.some((l) => l.target === 'ap')).toBe(false);
  });

  it('names the devices that belong to the second network, whether it is shown or not', () => {
    const expected = {
      'second-router': 'SECOND_NETWORK',
      'second-switch': 'SECOND_NETWORK',
      ap: 'SECOND_NETWORK',
    };
    expect(show(...known).layerOf).toEqual(expected);
    expect(show('ETHERNET').layerOf).toEqual(expected);
    // A machine with a leg on both networks belongs to neither layer.
    expect(show(...known).layerOf.machine).toBeUndefined();
  });

  it('keeps every device when an ordinary link type is switched off', () => {
    const out = show('NVME_OF', 'SECOND_NETWORK', 'TAILSCALE');
    expect(ids(out.nodes)).toEqual(ids(nodes));
    expect(out.links.some((l) => l.type === 'ETHERNET' || l.type === 'MOCA')).toBe(false);
  });

  it('shows a link type this build does not know, since it has no switch to turn it off', () => {
    const extra = [...links, link('machine', 'router', 'BRAND_NEW')];
    const out = visibleTopology(nodes, extra, new Set(['ETHERNET']), known);
    expect(out.links.map((l) => l.type)).toEqual(['ETHERNET', 'BRAND_NEW']);
  });
});
