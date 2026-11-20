import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ApolloProvider } from '@apollo/client/react';
import apolloClient from '../../lib/apolloClient';
import Layout from '../../components/layout';
import Seo from '../../components/seo';
import {
  PageWrapper,
  PageTitle,
  Subtitle,
  COLORS,
  healthColorFor,
} from '../../components/cluster/networkStyles';
import MonitoringMap, { SIGNAL_STYLES } from '../../components/cluster/MonitoringMap';
import useMonitoringTopology from '../../hooks/useMonitoringTopology';

const ALL_SIGNALS = Object.keys(SIGNAL_STYLES);

const Card = styled.div`
  background: ${COLORS.mapBg};
  border: 1px solid ${COLORS.border};
  border-radius: 8px;
  padding: 14px;
`;

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border: 1px solid ${(props) => (props.$active ? props.$color : COLORS.border)};
  border-radius: 4px;
  background: ${(props) => (props.$active ? `${props.$color}14` : 'transparent')};
  color: ${(props) => (props.$active ? props.$color : COLORS.text)};
  opacity: ${(props) => (props.$active ? 1 : 0.6)};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;

  &::before {
    content: '';
    width: 14px;
    height: 3px;
    border-radius: 2px;
    background: ${(props) => props.$color};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 16px;
  align-items: start;

  @media (max-width: 1150px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Label = styled.div`
  color: ${COLORS.text};
  opacity: 0.55;
  font-size: 11px;
  letter-spacing: 1.5px;
  margin: 14px 0 6px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid ${COLORS.border};
  font-size: 12.5px;
  line-height: 1.45;

  i {
    width: 10px;
    height: 3px;
    border-radius: 2px;
    margin-top: 8px;
    background: ${(props) => props.$color};
  }

  strong {
    color: ${(props) => props.$color};
    font-weight: 600;
  }
`;

const Message = styled.div`
  color: ${(props) => props.$color};
  padding: 40px;
  text-align: center;
`;

function Detail({ node, topology }) {
  if (!node) {
    return (
      <Card>
        <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.75 }}>
          Data moves left to right; the moving dashes show the direction. Pick a signal above to
          follow just that kind of data, or select any box to trace where its data comes from and
          where it ends up.
        </div>
      </Card>
    );
  }
  const nameOf = (id) => topology.nodes.find((n) => n.id === id)?.displayName || id;
  const incoming = topology.flows.filter((f) => f.to === node.id);
  const outgoing = topology.flows.filter((f) => f.from === node.id);
  const flowRow = (flow, other, arrow) => {
    const style = SIGNAL_STYLES[flow.signal] || { color: COLORS.gray, label: flow.signal };
    return (
      <Row key={`${flow.from}>${flow.to}>${flow.signal}`} $color={style.color}>
        <i />
        <span>
          <strong>
            {style.label} {arrow} {nameOf(other)}
          </strong>
          <br />
          {flow.note}
        </span>
      </Row>
    );
  };

  return (
    <Card>
      <div style={{ color: COLORS.green, fontSize: 15, fontWeight: 700 }}>{node.displayName}</div>
      <div style={{ fontSize: 11.5, opacity: 0.6, margin: '3px 0 10px' }}>{node.location}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{node.role}</div>

      <Label>RIGHT NOW</Label>
      <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
        {node.health ? (
          <span style={{ color: healthColorFor(node.health) }}>
            {node.health}
            {node.inferred ? ' (inferred from its host: it reports no metrics here)' : ''}
          </span>
        ) : (
          <span style={{ opacity: 0.6 }}>Not measured: this is a source, not a service.</span>
        )}
        {node.stat && <div style={{ opacity: 0.8 }}>{node.stat}</div>}
      </div>

      {incoming.length > 0 && <Label>RECEIVES</Label>}
      {incoming.map((f) => flowRow(f, f.from, 'from'))}
      {outgoing.length > 0 && <Label>SENDS</Label>}
      {outgoing.map((f) => flowRow(f, f.to, 'to'))}
    </Card>
  );
}

// Holds the data hook. Like the other cluster pages it must stay INSIDE
// <Layout> so data updates never re-render the header while it hydrates.
function MonitoringView() {
  const { topology, loading, error } = useMonitoringTopology();
  // An empty set means "all signals": the usual state.
  const [chosen, setChosen] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  const toggleSignal = useCallback((signal) => {
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(signal)) next.delete(signal);
      else next.add(signal);
      return next;
    });
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const visibleSignals = chosen.size ? chosen : new Set(ALL_SIGNALS);
  const selected = topology?.nodes.find((n) => n.id === selectedId) || null;

  return (
    <PageWrapper>
      <PageTitle>Monitoring</PageTitle>
      <Subtitle>
        How telemetry flows: from what is being watched, through the collectors, into the stores,
        and on to dashboards and alerts
      </Subtitle>

      {loading && <Message $color={COLORS.muted}>Connecting to gateway...</Message>}
      {error && (
        <Message $color={COLORS.red}>Failed to load monitoring map: {error.message}</Message>
      )}

      {topology && (
        <>
          <Bar>
            <span style={{ opacity: 0.55, letterSpacing: '0.5px' }}>FOLLOW:</span>
            {ALL_SIGNALS.map((signal) => (
              <Chip
                key={signal}
                type="button"
                $active={chosen.has(signal)}
                $color={SIGNAL_STYLES[signal].color}
                aria-pressed={chosen.has(signal)}
                onClick={() => toggleSignal(signal)}
              >
                {SIGNAL_STYLES[signal].label}
              </Chip>
            ))}
            {chosen.size > 0 && (
              <Chip type="button" $color={COLORS.text} onClick={() => setChosen(new Set())}>
                Show all
              </Chip>
            )}
          </Bar>
          <Grid>
            <Card>
              <MonitoringMap
                topology={topology}
                visibleSignals={visibleSignals}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </Card>
            <Detail node={selected} topology={topology} />
          </Grid>
        </>
      )}
    </PageWrapper>
  );
}

export default function MonitoringPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Seo title="Monitoring" />
        <MonitoringView />
      </Layout>
    </ApolloProvider>
  );
}
