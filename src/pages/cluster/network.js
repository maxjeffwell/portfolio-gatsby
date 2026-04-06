import React, { useState, useCallback } from 'react';
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

const ALL_LINK_TYPES = new Set(Object.keys(LINK_STYLES));

export default function NetworkPage() {
  const { topology, loading, error, lastUpdated } = useNetworkTopology();
  const [visibleLinkTypes, setVisibleLinkTypes] = useState(ALL_LINK_TYPES);
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
    <Layout>
      <Seo title="Network Visualization" />
      <PageWrapper>
        <PageTitle>Network Visualization</PageTitle>
        <Subtitle>
          Live infrastructure topology &mdash; K3s cluster, NAS, routers, and
          all connections
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
            <NetworkMap
              topology={topology}
              visibleLinkTypes={visibleLinkTypes}
              onNodeClick={handleNodeClick}
            />
            <DetailPanel
              node={selectedNode}
              links={topology.links}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}

        {/* Legend */}
        {topology && (
          <div
            style={{
              display: 'flex',
              gap: '24px',
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
    </Layout>
  );
}
