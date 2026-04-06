import React from 'react';
import styled from 'styled-components';
import { COLORS, NODE_COLORS } from './networkStyles';

const TooltipBox = styled.div`
  position: absolute;
  background: rgba(10, 14, 23, 0.95);
  border: 1px solid ${COLORS.border};
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 11px;
  z-index: 15;
  pointer-events: none;
  min-width: 160px;
  font-family: 'JetBrains Mono', monospace;
`;

const Title = styled.div`
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 12px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 2px;
`;

const Label = styled.span`
  color: ${COLORS.muted};
`;

const Value = styled.span`
  color: ${COLORS.text};
`;

export default function NetworkTooltip({ node, x, y }) {
  const color = NODE_COLORS[node.type] || COLORS.cyan;
  const m = node.metrics;

  return (
    <TooltipBox style={{ left: x, top: y }}>
      <Title style={{ color }}>{node.displayName}</Title>
      {m?.cpuPercent != null && (
        <Row>
          <Label>CPU</Label>
          <Value>{m.cpuPercent.toFixed(1)}%</Value>
        </Row>
      )}
      {m?.memoryUsedMb != null && m?.memoryTotalMb != null && (
        <Row>
          <Label>Memory</Label>
          <Value>
            {(m.memoryUsedMb / 1024).toFixed(1)} / {(m.memoryTotalMb / 1024).toFixed(1)} GB
          </Value>
        </Row>
      )}
      {m?.storageUsedGb != null && m?.storageTotalGb != null && (
        <Row>
          <Label>Storage</Label>
          <Value>
            {m.storageUsedGb} / {m.storageTotalGb} GB
          </Value>
        </Row>
      )}
      {m?.uptime && (
        <Row>
          <Label>Uptime</Label>
          <Value>{m.uptime}</Value>
        </Row>
      )}
      {node.services && (
        <Row>
          <Label>Services</Label>
          <Value>{node.services.length}</Value>
        </Row>
      )}
    </TooltipBox>
  );
}
