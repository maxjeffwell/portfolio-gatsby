import React from 'react';
import styled from 'styled-components';
import { COLORS, NODE_COLORS, LINK_STYLES } from './networkStyles';

const Panel = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: rgba(10, 14, 23, 0.95);
  border-left: 1px solid ${COLORS.border};
  padding: 16px;
  z-index: 20;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  transform: translateX(${(props) => (props.$open ? '0' : '100%')});
  transition: transform 0.3s ease;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: ${COLORS.muted};
  cursor: pointer;
  font-size: 16px;
  padding: 4px;

  &:hover {
    color: ${COLORS.text};
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const PanelSubtitle = styled.div`
  font-size: 11px;
  color: ${COLORS.muted};
  margin-bottom: 16px;
`;

const Section = styled.div`
  margin-bottom: 14px;
`;

const SectionTitle = styled.h4`
  font-size: 11px;
  color: ${COLORS.muted};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
  font-weight: 400;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 4px;
`;

const MetricValue = styled.span`
  color: ${COLORS.cyan};
`;

const UsageBar = styled.div`
  height: 4px;
  background: ${COLORS.border};
  border-radius: 2px;
  margin-top: 2px;
  margin-bottom: 8px;
`;

const UsageFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.green});
  width: ${(props) => Math.min(props.$percent, 100)}%;
`;

const HealthDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  background: ${(props) =>
    props.$status === 'HEALTHY'
      ? COLORS.green
      : props.$status === 'DEGRADED'
        ? COLORS.amber
        : COLORS.red};
`;

const ConnRow = styled.div`
  font-size: 11px;
  padding: 4px 0;
  border-bottom: 1px solid ${COLORS.border};
  display: flex;
  justify-content: space-between;
`;

const ConnType = styled.span`
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 9px;
  background: ${(props) => `${props.$color}26`};
  color: ${(props) => props.$color};
`;

export default function DetailPanel({ node, links, onClose }) {
  if (!node) return <Panel $open={false} />;

  const color = NODE_COLORS[node.type] || COLORS.cyan;
  const m = node.metrics;

  const nodeLinks =
    links?.filter(
      (l) => l.source === node.id || l.target === node.id,
    ) || [];

  return (
    <Panel $open={!!node}>
      <CloseBtn onClick={onClose}>&times;</CloseBtn>
      <Title style={{ color }}>{node.displayName}</Title>
      <PanelSubtitle>
        {node.wireguardIp || ''} &middot; Zone:{' '}
        {node.zone.replace('_', ' ')} &middot; {node.health}
      </PanelSubtitle>

      {m && (
        <Section>
          <SectionTitle>System Metrics</SectionTitle>
          {m.cpuPercent != null && (
            <>
              <MetricRow>
                <span>CPU</span>
                <MetricValue>{m.cpuPercent.toFixed(1)}%</MetricValue>
              </MetricRow>
              <UsageBar>
                <UsageFill $percent={m.cpuPercent} />
              </UsageBar>
            </>
          )}
          {m.memoryUsedMb != null && m.memoryTotalMb != null && (
            <>
              <MetricRow>
                <span>Memory</span>
                <MetricValue>
                  {(m.memoryUsedMb / 1024).toFixed(1)} /{' '}
                  {(m.memoryTotalMb / 1024).toFixed(1)} GB
                </MetricValue>
              </MetricRow>
              <UsageBar>
                <UsageFill $percent={m.memoryPercent || 0} />
              </UsageBar>
            </>
          )}
          {m.storageUsedGb != null && m.storageTotalGb != null && (
            <>
              <MetricRow>
                <span>Storage</span>
                <MetricValue>
                  {m.storageUsedGb} / {m.storageTotalGb} GB
                </MetricValue>
              </MetricRow>
              <UsageBar>
                <UsageFill
                  $percent={(m.storageUsedGb / m.storageTotalGb) * 100}
                />
              </UsageBar>
            </>
          )}
          {m.uptime && (
            <MetricRow>
              <span>Uptime</span>
              <MetricValue>{m.uptime}</MetricValue>
            </MetricRow>
          )}
        </Section>
      )}

      <Section>
        <SectionTitle>Services</SectionTitle>
        {node.services?.map((svc) => (
          <MetricRow key={svc.name}>
            <span>
              <HealthDot $status={svc.status} />
              {svc.name}
            </span>
            {svc.port && <MetricValue>:{svc.port}</MetricValue>}
          </MetricRow>
        ))}
      </Section>

      {nodeLinks.length > 0 && (
        <Section>
          <SectionTitle>Connections</SectionTitle>
          {nodeLinks.map((link, i) => {
            const peer =
              link.source === node.id ? link.target : link.source;
            const style = LINK_STYLES[link.type];
            return (
              <ConnRow key={`${peer}-${link.type}-${i}`}>
                <span>&rarr; {peer}</span>
                <ConnType $color={style?.color || COLORS.cyan}>
                  {link.type.replace(/_/g, ' ')}
                </ConnType>
              </ConnRow>
            );
          })}
        </Section>
      )}
    </Panel>
  );
}
