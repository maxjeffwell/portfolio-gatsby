import {
  particlePlan,
  formatTraffic,
  MIN_TRAFFIC_BPS,
  MAX_PARTICLES,
  planParticles,
} from '../traffic';

const link = (throughputBps, status = 'HEALTHY') => ({
  source: 'a',
  target: 'b',
  type: 'NVME_OF',
  status,
  throughputBps,
});

describe('particlePlan', () => {
  it('draws nothing on a link nobody measures', () => {
    expect(particlePlan(link(null))).toBeNull();
    expect(particlePlan(link(undefined))).toBeNull();
  });

  it('draws nothing on an idle link', () => {
    expect(particlePlan(link(0))).toBeNull();
    expect(particlePlan(link(MIN_TRAFFIC_BPS - 1))).toBeNull();
  });

  it('draws nothing on a link that is not healthy, whatever it reports', () => {
    expect(particlePlan(link(5e6, 'OFFLINE'))).toBeNull();
    expect(particlePlan(link(5e6, 'DEGRADED'))).toBeNull();
  });

  it('moves faster as traffic grows', () => {
    const slow = particlePlan(link(2e3));
    const mid = particlePlan(link(5e6));
    const fast = particlePlan(link(800e6));
    expect(slow.durationS).toBeGreaterThan(mid.durationS);
    expect(mid.durationS).toBeGreaterThan(fast.durationS);
  });

  it('shows more dots on busier links', () => {
    expect(particlePlan(link(50e3)).count).toBe(1);
    expect(particlePlan(link(5e6)).count).toBe(2);
    expect(particlePlan(link(500e6)).count).toBe(3);
  });

  it('keeps the speed within sane bounds at the extremes', () => {
    expect(particlePlan(link(MIN_TRAFFIC_BPS)).durationS).toBeLessThanOrEqual(6);
    expect(particlePlan(link(40e9)).durationS).toBeGreaterThanOrEqual(1.5);
  });
});

describe('planParticles', () => {
  it('plans only the links with measured traffic, busiest first when it has to drop some', () => {
    const links = [link(null), link(3e3), link(0), link(9e6)];
    const plans = planParticles(links);
    expect(plans.map((p) => p.link.throughputBps)).toEqual([9e6, 3e3]);
  });

  it('never plans more dots than the cap', () => {
    const many = Array.from({ length: 200 }, () => link(900e6));
    const dots = planParticles(many).reduce((n, p) => n + p.count, 0);
    expect(dots).toBeLessThanOrEqual(MAX_PARTICLES);
  });
});

describe('formatTraffic', () => {
  it('says nothing for an unmeasured link', () => {
    expect(formatTraffic(null)).toBeNull();
    expect(formatTraffic(undefined)).toBeNull();
  });

  it('calls a measured link below the threshold idle', () => {
    expect(formatTraffic(0)).toBe('idle');
    expect(formatTraffic(400)).toBe('idle');
  });

  it('uses the unit that fits', () => {
    expect(formatTraffic(22600)).toBe('23 kb/s');
    expect(formatTraffic(5.1e6)).toBe('5.1 Mb/s');
    expect(formatTraffic(140e6)).toBe('140 Mb/s');
    expect(formatTraffic(2.36e9)).toBe('2.4 Gb/s');
  });
});
