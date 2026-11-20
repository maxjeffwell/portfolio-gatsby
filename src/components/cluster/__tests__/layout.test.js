import layoutNodes from '../layout';
import { ZONE_BOUNDS } from '../networkStyles';

const SIZE = { width: 1000, height: 700 };
const NODE_WIDTH = 160;

const node = (id, zone) => ({ id, zone });
const home = (n) => Array.from({ length: n }, (_, i) => node(`h${i}`, 'HOME_NETWORK'));

describe('layoutNodes', () => {
  it('returns the same positions for the same nodes', () => {
    const nodes = [node('a', 'CLOUD'), ...home(8), node('s', 'STORAGE')];
    expect(layoutNodes(nodes, SIZE)).toEqual(layoutNodes(nodes, SIZE));
  });

  it('keeps every node inside its zone band and the map width', () => {
    const nodes = [node('a', 'CLOUD'), ...home(8), node('s1', 'STORAGE'), node('s2', 'STORAGE')];
    const zoneOf = Object.fromEntries(nodes.map((n) => [n.id, n.zone]));

    layoutNodes(nodes, SIZE).forEach((p) => {
      const { yMin, yMax } = ZONE_BOUNDS[zoneOf[p.id]];
      expect(p.y).toBeGreaterThanOrEqual(yMin * SIZE.height);
      expect(p.y).toBeLessThanOrEqual(yMax * SIZE.height);
      expect(p.x - NODE_WIDTH / 2).toBeGreaterThanOrEqual(0);
      expect(p.x + NODE_WIDTH / 2).toBeLessThanOrEqual(SIZE.width);
    });
  });

  it('never places two nodes closer than a node width in the same row', () => {
    const positions = layoutNodes(home(8), SIZE);
    positions.forEach((a, i) => {
      positions.slice(i + 1).forEach((b) => {
        const sameRow = Math.abs(a.y - b.y) < 60;
        if (sameRow) expect(Math.abs(a.x - b.x)).toBeGreaterThanOrEqual(NODE_WIDTH);
      });
    });
  });

  it('skips nodes in unknown zones and tolerates no nodes', () => {
    expect(layoutNodes([node('x', 'MARS')], SIZE)).toEqual([]);
    expect(layoutNodes(undefined, SIZE)).toEqual([]);
  });
});
