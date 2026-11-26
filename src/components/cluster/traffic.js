// Turning a link's measured traffic into what the map draws.
//
// `throughputBps` comes from the gateway: bits per second right now, or null
// when nothing measures that link. Null is "not measured", never "idle", so an
// unmeasured link gets no dot and no figure rather than a made-up one.

// Below this a measured link is shown as idle: no dot, "idle" in the panel.
export const MIN_TRAFFIC_BPS = 1000;

// Upper bound on animated dots, to keep the SVG light on phones.
export const MAX_PARTICLES = 60;

const SLOWEST_S = 6; // one crossing at MIN_TRAFFIC_BPS
const FASTEST_S = 1.5; // one crossing at 1 Gb/s and above
const DECADES = 6; // 1 kb/s .. 1 Gb/s

// How to animate one link, or null to leave it still. Speed follows the
// order of magnitude of the rate, so 20 kb/s and 2 Gb/s are both readable.
export function particlePlan(link) {
  const bps = link?.throughputBps;
  if (link?.status !== 'HEALTHY' || !Number.isFinite(bps) || bps < MIN_TRAFFIC_BPS) return null;

  const decades = Math.min(DECADES, Math.max(0, Math.log10(bps) - 3));
  const durationS =
    Math.round((SLOWEST_S - (decades / DECADES) * (SLOWEST_S - FASTEST_S)) * 10) / 10;
  let count = 1;
  if (bps >= 100e6) count = 3;
  else if (bps >= 1e6) count = 2;
  return { count, durationS };
}

// Plans for every link that has traffic to show. When the cap would be
// exceeded the quietest links lose their dots first.
export function planParticles(links) {
  const plans = links
    .map((link) => ({ link, plan: particlePlan(link) }))
    .filter((entry) => entry.plan)
    .sort((a, b) => b.link.throughputBps - a.link.throughputBps);

  const kept = [];
  let dots = 0;
  plans.forEach(({ link, plan }) => {
    if (dots + plan.count > MAX_PARTICLES) return;
    dots += plan.count;
    kept.push({ link, ...plan });
  });
  return kept;
}

// "5.1 Mb/s", "idle" for a measured link below the threshold, null when the
// link is not measured at all.
export function formatTraffic(bps) {
  if (!Number.isFinite(bps)) return null;
  if (bps < MIN_TRAFFIC_BPS) return 'idle';
  const short = (value) => (value >= 100 ? `${Math.round(value)}` : `${+value.toPrecision(2)}`);
  if (bps >= 1e9) return `${short(bps / 1e9)} Gb/s`;
  if (bps >= 1e6) return `${short(bps / 1e6)} Mb/s`;
  return `${short(bps / 1e3)} kb/s`;
}
