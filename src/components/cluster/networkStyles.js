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
  gray: '#888888',
};

export const NODE_COLORS = {
  K8S_NODE: COLORS.cyan,
  NAS: COLORS.green,
  ROUTER: COLORS.amber,
};

export const LINK_STYLES = {
  WIREGUARD: { color: COLORS.cyan, width: 2, dashArray: null },
  ISCSI: { color: COLORS.red, width: 3, dashArray: '8 4' },
  GARAGE_REPLICATION: { color: COLORS.green, width: 1.5, dashArray: '3 3' },
  LOKI: { color: COLORS.purple, width: 1, dashArray: null },
  NFS: { color: COLORS.gray, width: 1, dashArray: '4 4' },
};

export const ZONE_BOUNDS = {
  CLOUD: { yMin: 0.05, yMax: 0.3 },
  HOME_NETWORK: { yMin: 0.35, yMax: 0.65 },
  STORAGE: { yMin: 0.7, yMax: 0.95 },
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
  height: 600px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(
        rgba(0, 240, 255, 0.03) 1px,
        transparent 1px
      ),
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
