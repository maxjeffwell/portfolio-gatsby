import styled, { keyframes } from 'styled-components';

export const COLORS = {
  bg: '#0a0e17',
  mapBg: '#0d1220',
  border: '#1a2040',
  text: '#c0c8d8',
  muted: '#556',
  cyan: '#00f0ff',
  green: '#00ff88',
  amber: '#ffaa00',
  red: '#ff4444',
  purple: '#aa66ff',
  blue: '#4d9fff',
  pink: '#ff66c4',
  orange: '#ff7a3d',
  white: '#dfe7f5',
  lime: '#b8f400',
  slate: '#8fa3c8',
  teal: '#2dd4bf',
  gray: '#888888',
};

const HEALTH_COLORS = {
  HEALTHY: COLORS.green,
  DEGRADED: COLORS.amber,
};

// Anything that is not explicitly healthy or degraded renders as red.
export const healthColorFor = (status) => HEALTH_COLORS[status] || COLORS.red;

// 2500000000 -> "2.5 Gb/s". Returns null when the speed is unknown.
export const formatBandwidth = (bps) => {
  if (!bps) return null;
  return bps >= 1e9 ? `${+(bps / 1e9).toFixed(1)} Gb/s` : `${Math.round(bps / 1e6)} Mb/s`;
};

export const NODE_COLORS = {
  K8S_NODE: COLORS.cyan,
  NAS: COLORS.green,
  ROUTER: COLORS.amber,
  SWITCH: COLORS.slate,
  REPLICATED_STORAGE: COLORS.purple,
  LOCAL_STORAGE: COLORS.teal,
  OFFSITE_BACKUP: COLORS.orange,
};

export const LINK_STYLES = {
  TAILSCALE: { color: COLORS.pink, width: 1.5, dashArray: null },
  WIREGUARD: { color: COLORS.cyan, width: 2, dashArray: '6 3' },
  ETHERNET: { color: COLORS.white, width: 1.6, dashArray: null },
  MOCA: { color: COLORS.lime, width: 2.5, dashArray: '2 5' },
  BACKHAUL: { color: COLORS.blue, width: 2.5, dashArray: '10 3' },
  NVME_OF: { color: COLORS.amber, width: 2.5, dashArray: null },
  LOCAL_VOLUME: { color: COLORS.teal, width: 2, dashArray: null },
  ISCSI: { color: COLORS.red, width: 3, dashArray: '8 4' },
  GARAGE_REPLICATION: { color: COLORS.green, width: 1.5, dashArray: '3 3' },
  LOKI: { color: COLORS.purple, width: 1, dashArray: null },
  NFS: { color: COLORS.gray, width: 1, dashArray: '4 4' },
  OFFSITE_BACKUP: { color: COLORS.orange, width: 2, dashArray: '2 4' },
};

export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const MapContainer = styled.div`
  position: relative;
  background: ${COLORS.mapBg};
  border: 1px solid ${COLORS.border};
  border-radius: 8px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }
`;

export const PageWrapper = styled.div`
  background: ${COLORS.bg};
  min-height: 100vh;
  color: ${COLORS.text};
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  padding: 20px;

  && {
    background: ${COLORS.bg};
    color: ${COLORS.text};
  }
`;

export const PageTitle = styled.h2`
  color: ${COLORS.cyan};
  font-size: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: ${COLORS.muted};
  font-size: 13px;
  margin-bottom: 20px;
`;
