import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ApolloProvider } from '@apollo/client/react';
import apolloClient from '../../lib/apolloClient';
import Layout from '../../components/layout';
import Seo from '../../components/seo';
import { PageWrapper, PageTitle, Subtitle, COLORS } from '../../components/cluster/networkStyles';
import DatabaseMap, { RELATION_STYLES } from '../../components/cluster/DatabaseMap';
import DatabaseDetail from '../../components/cluster/DatabaseDetail';
import useDatabaseTopology from '../../hooks/useDatabaseTopology';

const ALL_RELATIONS = new Set(Object.keys(RELATION_STYLES));

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const MapCard = styled.div`
  background: ${COLORS.mapBg};
  border: 1px solid ${COLORS.border};
  border-radius: 8px;
  padding: 8px;
`;

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
  font-size: 11px;
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
`;

const Note = styled.div`
  color: ${COLORS.muted};
  font-size: 11px;
  margin-top: 10px;
`;

const Message = styled.div`
  color: ${(props) => props.$color};
  padding: 40px;
  text-align: center;
`;

// Holds the data hooks. Like the network page, it must stay INSIDE <Layout>
// so data updates never re-render the header while it hydrates.
function DatabasesView() {
  const { topology, loading, error } = useDatabaseTopology();
  const [visibleRelations, setVisibleRelations] = useState(ALL_RELATIONS);
  const [selectedId, setSelectedId] = useState(null);

  const toggleRelation = useCallback((relation) => {
    setVisibleRelations((prev) => {
      const next = new Set(prev);
      if (next.has(relation)) next.delete(relation);
      else next.add(relation);
      return next;
    });
  }, []);

  const handleSelect = useCallback((node) => {
    setSelectedId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const selectedDatabase = topology?.databases.find((db) => `db:${db.id}` === selectedId) || null;

  return (
    <PageWrapper>
      <PageTitle>Databases</PageTitle>
      <Subtitle>
        Which application uses which database, where each instance runs, what it stores data on, and
        where it is backed up
      </Subtitle>

      {loading && <Message $color={COLORS.muted}>Connecting to gateway...</Message>}
      {error && <Message $color={COLORS.red}>Failed to load databases: {error.message}</Message>}

      {topology && (
        <>
          <Bar>
            <span style={{ color: COLORS.muted, letterSpacing: '0.5px' }}>SHOW:</span>
            {Object.entries(RELATION_STYLES).map(([relation, style]) => (
              <FilterBtn
                key={relation}
                type="button"
                $active={visibleRelations.has(relation)}
                $color={style.color}
                aria-pressed={visibleRelations.has(relation)}
                onClick={() => toggleRelation(relation)}
              >
                {style.label}
              </FilterBtn>
            ))}
          </Bar>
          <Grid>
            <MapCard>
              <DatabaseMap
                topology={topology}
                visibleRelations={visibleRelations}
                selectedId={selectedId}
                onSelect={handleSelect}
              />
            </MapCard>
            <DatabaseDetail database={selectedDatabase} apps={topology.apps} />
          </Grid>
          <Note>
            Dots on a database are its instances (ringed = primary). A thick &ldquo;runs on&rdquo;
            line leads to the primary. Red backup lines are overdue; grey ones have no live
            monitoring signal.
          </Note>
        </>
      )}
    </PageWrapper>
  );
}

export default function DatabasesPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Seo title="Databases" />
        <DatabasesView />
      </Layout>
    </ApolloProvider>
  );
}
