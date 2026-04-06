import React from 'react';
import styled from 'styled-components';
import { COLORS, LINK_STYLES, pulse } from './networkStyles';

const Bar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: rgba(13, 18, 32, 0.9);
  border-bottom: 1px solid ${COLORS.border};
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
`;

const FilterLabel = styled.span`
  color: ${COLORS.muted};
  font-size: 11px;
  letter-spacing: 0.5px;
`;

const FilterBtn = styled.button`
  padding: 4px 10px;
  border: 1px solid ${(props) => (props.$active ? props.$color : COLORS.border)};
  border-radius: 4px;
  background: ${(props) => (props.$active ? `${props.$color}14` : 'transparent')};
  color: ${(props) => (props.$active ? props.$color : COLORS.muted)};
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  letter-spacing: 0.5px;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => props.$color};
    color: ${(props) => props.$color};
  }
`;

const LiveIndicator = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${COLORS.green};
  font-size: 11px;
`;

const LiveDot = styled.div`
  width: 6px;
  height: 6px;
  background: ${COLORS.green};
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
  box-shadow: 0 0 8px ${COLORS.green};
`;

const FILTER_OPTIONS = [
  { type: 'WIREGUARD', label: 'WireGuard' },
  { type: 'ISCSI', label: 'iSCSI' },
  { type: 'GARAGE_REPLICATION', label: 'Garage S3' },
  { type: 'LOKI', label: 'Loki' },
  { type: 'NFS', label: 'NFS' },
];

export default function FilterControls({
  visibleLinkTypes,
  onToggle,
  lastUpdated,
}) {
  const secondsAgo = lastUpdated
    ? Math.round((Date.now() - new Date(lastUpdated).getTime()) / 1000)
    : null;

  return (
    <Bar>
      <FilterLabel>FILTER:</FilterLabel>
      {FILTER_OPTIONS.map((opt) => (
        <FilterBtn
          key={opt.type}
          $active={visibleLinkTypes.has(opt.type)}
          $color={LINK_STYLES[opt.type].color}
          onClick={() => onToggle(opt.type)}
        >
          {opt.label}
        </FilterBtn>
      ))}
      <LiveIndicator>
        <LiveDot />
        LIVE {secondsAgo != null ? `\u2014 Updated ${secondsAgo}s ago` : ''}
      </LiveIndicator>
    </Bar>
  );
}
