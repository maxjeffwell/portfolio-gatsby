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
  LINK_STYLES,
} from '../../components/cluster/networkStyles';
import NetworkMap from '../../components/cluster/NetworkMap';
import FilterControls from '../../components/cluster/FilterControls';
import DetailPanel from '../../components/cluster/DetailPanel';
import useNetworkTopology from '../../hooks/useNetworkTopology';
import { LAYER_LINK_TYPES } from '../../components/cluster/layout';

// The map and, when a node is selected, its detail panel side by side.
const MapAndPanel = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Everything is shown at first except the optional layers: the second network
// carries no cluster traffic, so it appears only when its filter is switched on.
const INITIAL_LINK_TYPES = new Set(
  Object.keys(LINK_STYLES).filter((type) => !LAYER_LINK_TYPES.includes(type))
);

// Holds the data hooks. It must stay INSIDE <Layout>: when these hooks lived
// above it, every topology update re-rendered the header while its lazy
// components were still hydrating (React error #421).
function NetworkView() {
  const { topology, loading, error, lastUpdated } = useNetworkTopology();
  const [visibleLinkTypes, setVisibleLinkTypes] = useState(INITIAL_LINK_TYPES);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleToggleFilter = useCallback((type) => {
    setVisibleLinkTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  return (
    <PageWrapper>
      <PageTitle>Network Visualization</PageTitle>
      <Subtitle>
        Live infrastructure topology &mdash; K3s cluster, storage, overlay networks, and off-site
        backup
      </Subtitle>

      {loading && !topology && (
        <div
          style={{
            color: COLORS.muted,
            padding: '40px',
            textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Connecting to gateway...
        </div>
      )}

      {error && !topology && (
        <div
          style={{
            color: COLORS.red,
            padding: '40px',
            textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Failed to load topology: {error.message}
        </div>
      )}

      {topology && (
        <div style={{ position: 'relative' }}>
          <FilterControls
            visibleLinkTypes={visibleLinkTypes}
            onToggle={handleToggleFilter}
            lastUpdated={lastUpdated}
          />
          <MapAndPanel>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <NetworkMap
                topology={topology}
                visibleLinkTypes={visibleLinkTypes}
                onNodeClick={handleNodeClick}
              />
            </div>
            <DetailPanel
              node={selectedNode}
              nodes={topology.nodes}
              links={topology.links}
              onClose={() => setSelectedNode(null)}
            />
          </MapAndPanel>
        </div>
      )}

      {topology && (
        <p
          style={{
            margin: '12px 0 0',
            fontSize: '12px',
            color: COLORS.muted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          A moving dot is measured traffic: more dots, moving faster, mean more data. A link without
          one is idle or has no counter to read.
        </p>
      )}

      {/* Legend */}
      {topology && (
        <div
          style={{
            display: 'flex',
            gap: '12px 24px',
            flexWrap: 'wrap',
            marginTop: '12px',
            fontSize: '12px',
            color: COLORS.muted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {Object.entries(LINK_STYLES).map(([type, style]) => (
            <span
              key={type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <svg width="20" height="4">
                <line
                  x1="0"
                  y1="2"
                  x2="20"
                  y2="2"
                  stroke={style.color}
                  strokeWidth={style.width}
                  strokeDasharray={style.dashArray || undefined}
                />
              </svg>
              {type.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

// Apollo hooks need a client in context; like cluster.js, this page provides its own.
export default function NetworkPage() {
  return (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Seo title="Network Visualization" />
        <NetworkView />
      </Layout>
    </ApolloProvider>
  );
}
