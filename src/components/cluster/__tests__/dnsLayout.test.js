import { positionOf, hopPath, numberHops, mainRoute, shortStat, WIDTH, HEIGHT } from '../dnsLayout';

const IDS = [
  'client',
  'node-local',
  'coredns',
  'kube-api',
  'router-dnsmasq',
  'router-unbound',
  'blocky',
  'mesh-unbound',
  'tailscale',
  'cloudflare',
  'provider',
  'authoritative',
];

describe('dns layout', () => {
  it('places every resolver inside the canvas without overlap', () => {
    const boxes = IDS.map(positionOf);
    boxes.forEach((b) => {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w).toBeLessThanOrEqual(WIDTH);
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.y + b.h).toBeLessThanOrEqual(HEIGHT);
    });
    boxes.forEach((a, i) => {
      boxes.slice(i + 1).forEach((b) => {
        const apart = Math.abs(a.x - b.x) >= a.w || Math.abs(a.y - b.y) >= a.h;
        expect(apart).toBe(true);
      });
    });
  });

  it('returns nothing for an unknown resolver', () => {
    expect(positionOf('nope')).toBeNull();
  });

  it('joins boxes on facing sides, and bows around when they share a column', () => {
    const client = positionOf('client');
    const forward = hopPath(client, positionOf('node-local'));
    expect(forward.d.startsWith(`M ${client.x + client.w} `)).toBe(true);

    const coredns = positionOf('coredns');
    const back = hopPath(coredns, positionOf('tailscale'));
    expect(back.d.startsWith(`M ${coredns.x} `)).toBe(true);

    const vertical = hopPath(coredns, positionOf('router-dnsmasq'));
    expect(vertical.mid.x).toBeGreaterThan(coredns.x + coredns.w / 2);
  });

  it('numbers the main route and leaves alternates unnumbered', () => {
    const hops = numberHops([
      { to: 'a', fallback: false },
      { to: 'b', fallback: true },
      { to: 'c', fallback: false },
    ]);
    expect(hops.map((h) => h.step)).toEqual([1, null, 2]);
    expect(numberHops(undefined)).toEqual([]);
  });

  it('lists the main route once per resolver, without alternates', () => {
    const route = mainRoute([
      { from: 'client', to: 'a', fallback: false },
      { from: 'a', to: 'b', fallback: true },
      { from: 'a', to: 'c', fallback: false },
      { from: 'b', to: 'c', fallback: false },
    ]);
    expect(route).toEqual(['client', 'a', 'c']);
    expect(mainRoute(undefined)).toEqual(['client']);
  });

  it('shortens a load figure to what fits in a box', () => {
    expect(shortStat('7/7 nodes \u00b7 58 queries/s \u00b7 88% from cache')).toBe(
      '7/7 nodes \u00b7 58 q/s'
    );
    expect(shortStat('0.3 queries/s')).toBe('0.3 q/s');
    expect(shortStat(null)).toBeNull();
  });
});
