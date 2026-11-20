import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ApolloProvider } from '@apollo/client/react';
import apolloClient from '../../lib/apolloClient';
import Layout from '../../components/layout';
import Seo from '../../components/seo';
import { PageWrapper, PageTitle, Subtitle, COLORS } from '../../components/cluster/networkStyles';
import DnsMap from '../../components/cluster/DnsMap';
import { numberHops } from '../../components/cluster/dnsLayout';
import useDnsTopology from '../../hooks/useDnsTopology';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 16px;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Card = styled.div`
  background: ${COLORS.mapBg};
  border: 1px solid ${COLORS.border};
  border-radius: 8px;
  padding: 12px;
`;

const Label = styled.div`
  color: ${COLORS.muted};
  font-size: 10px;
  letter-spacing: 1.5px;
  margin: 4px 0 8px;
`;

const Choice = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  margin-bottom: 6px;
  border: 1px solid ${(props) => (props.$active ? props.$color : COLORS.border)};
  border-radius: 5px;
  background: ${(props) => (props.$active ? `${props.$color}14` : 'transparent')};
  color: ${(props) => (props.$active ? props.$color : COLORS.text)};
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;

  small {
    display: block;
    margin-top: 2px;
    color: ${COLORS.muted};
    font-size: 10px;
  }
`;

const Summary = styled.p`
  color: ${(props) => props.$color};
  font-size: 13px;
  margin: 0 0 12px;
`;

const Step = styled.li`
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid ${COLORS.border};
  font-size: 12px;
  color: ${(props) => (props.$alt ? COLORS.muted : COLORS.text)};

  strong {
    color: ${(props) => (props.$alt ? COLORS.gray : COLORS.cyan)};
    font-weight: 600;
  }
`;

const Badge = styled.span`
  display: inline-block;
  min-width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  border-radius: 10px;
  border: 1px solid ${(props) => props.$color};
  color: ${(props) => props.$color};
  font-size: 10px;
`;

const Message = styled.div`
  color: ${(props) => props.$color};
  padding: 40px;
  text-align: center;
`;

// Holds the data hook. Like the other cluster pages it must stay INSIDE
// <Layout> so data updates never re-render the header while it hydrates.
function DnsView() {
  const { topology, loading, error } = useDnsTopology();
  const [clientId, setClientId] = useState('pod');
  const [kindId, setKindId] = useState('internet');

  const nameOf = useMemo(() => {
    const names = { client: 'The asker' };
    (topology?.resolvers || []).forEach((r) => {
      names[r.id] = `${r.displayName} (${r.location})`;
    });
    return (id) => names[id] || id;
  }, [topology]);

  const client = topology?.clients.find((c) => c.id === clientId) || topology?.clients[0];
  const path = topology?.paths.find((p) => p.client === client?.id && p.nameKind === kindId);
  const hops = numberHops(path?.hops);
  const roles = (topology?.resolvers || []).filter((r) =>
    hops.some((h) => h.from === r.id || h.to === r.id)
  );

  return (
    <PageWrapper>
      <PageTitle>DNS</PageTitle>
      <Subtitle>
        How a name gets resolved: pick who is asking and what kind of name, and follow the query
        through the cluster, the home LAN and out to the internet
      </Subtitle>

      {loading && <Message $color={COLORS.muted}>Connecting to gateway...</Message>}
      {error && <Message $color={COLORS.red}>Failed to load DNS map: {error.message}</Message>}

      {topology && client && (
        <Grid>
          <Card>
            <Label>WHO IS ASKING</Label>
            {topology.clients.map((c) => (
              <Choice
                key={c.id}
                type="button"
                $active={c.id === client.id}
                $color={COLORS.amber}
                aria-pressed={c.id === client.id}
                onClick={() => setClientId(c.id)}
              >
                {c.displayName}
                {c.detail && <small>{c.detail}</small>}
              </Choice>
            ))}
            <Label style={{ marginTop: 14 }}>FOR WHAT KIND OF NAME</Label>
            {topology.nameKinds.map((k) => (
              <Choice
                key={k.id}
                type="button"
                $active={k.id === kindId}
                $color={COLORS.cyan}
                aria-pressed={k.id === kindId}
                onClick={() => setKindId(k.id)}
              >
                {k.label}
                <small>{k.example}</small>
              </Choice>
            ))}
          </Card>

          <div>
            <Card>
              <DnsMap resolvers={topology.resolvers} client={client} hops={hops} />
            </Card>

            <Card style={{ marginTop: 16 }}>
              {path && (
                <Summary $color={path.resolves ? COLORS.green : COLORS.red}>
                  {path.resolves ? '' : 'Does not resolve. '}
                  {path.summary}
                </Summary>
              )}
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {hops.map((hop) => (
                  <Step key={`${hop.from}>${hop.to}`} $alt={hop.fallback}>
                    <Badge $color={hop.fallback ? COLORS.gray : COLORS.cyan}>
                      {hop.step || 'alt'}
                    </Badge>
                    <span>
                      <strong>
                        {nameOf(hop.from)} &rarr; {nameOf(hop.to)}
                      </strong>
                      <br />
                      {hop.note}
                    </span>
                  </Step>
                ))}
              </ol>
              {roles.length > 0 && (
                <>
                  <Label style={{ marginTop: 16 }}>WHAT EACH RESOLVER ON THIS PATH DOES</Label>
                  {roles.map((r) => (
                    <Step as="div" key={r.id} $alt>
                      <span />
                      <span>
                        <strong style={{ color: COLORS.green }}>
                          {r.displayName} &middot; {r.location}
                        </strong>
                        {r.stat && <em style={{ color: COLORS.muted }}> ({r.stat})</em>}
                        <br />
                        {r.role}
                      </span>
                    </Step>
                  ))}
                </>
              )}
            </Card>
          </div>
        </Grid>
      )}
    </PageWrapper>
  );
}

export default function DnsPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Seo title="DNS" />
        <DnsView />
      </Layout>
    </ApolloProvider>
  );
}
