import { positionOf, hopPath, numberHops, WIDTH, HEIGHT } from '../dnsLayout';

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
    const forward = hopPath(positionOf('client'), positionOf('node-local'));
    expect(forward.d.startsWith(`M ${16 + 184} `)).toBe(true);

    const back = hopPath(positionOf('coredns'), positionOf('tailscale'));
    expect(back.d.startsWith('M 448 ')).toBe(true);

    const vertical = hopPath(positionOf('coredns'), positionOf('router-dnsmasq'));
    expect(vertical.mid.x).toBeGreaterThan(448 + 92);
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
});
