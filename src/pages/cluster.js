import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client/react';
import { useTheme } from '../context/ThemeContext';
import { CLUSTER_METRICS_QUERY } from '../graphql/gateway';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageTransition from '../components/PageTransition';
import MotionWrapper from '../components/MotionWrapper';

const API_BASE = 'https://podrick.el-jefe.me/devops-api';

// ── Styled Components ──────────────────────────────────────────

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 16px;
  }
`;

const PageTitle = styled.h1`
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, #90caf9 0%, #ce93d8 50%, #f48fb1 100%)'
      : 'linear-gradient(135deg, #1565c0 0%, #9c27b0 50%, #e91e63 100%)'};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: clamp(2rem, 6vw, 3rem);
  line-height: 1.2;
  text-align: center;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  text-align: center;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: ${(props) => (props.theme?.mode === 'dark' ? '#e0e0e0' : 'rgba(0,0,0,0.6)')};
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#333')};
  margin-bottom: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 48px;
`;

const StatCard = styled.div`
  background: ${(props) => (props.theme?.mode === 'dark' ? '#1a1a1a' : '#ffffff')};
  border: 1px solid ${(props) => (props.theme?.mode === 'dark' ? '#333' : '#e0e0e0')};
  border-radius: 12px;
  padding: 20px;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#808080' : '#999')};
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#e0e0e0' : '#212121')};
  line-height: 1;
`;

const StatUnit = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#b0b0b0' : '#666')};
  margin-left: 4px;
`;

const UsageBarTrack = styled.div`
  height: 6px;
  background: ${(props) => (props.theme?.mode === 'dark' ? '#333' : '#e0e0e0')};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 12px;
`;

const UsageBarFill = styled.div`
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
  background: ${(props) => props.color || '#1976d2'};
  width: ${(props) => props.percent || 0}%;
`;

const UsageDetail = styled.div`
  font-size: 12px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#808080' : '#999')};
  margin-top: 6px;
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 48px;
`;

const AppRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => (props.theme?.mode === 'dark' ? '#1a1a1a' : '#ffffff')};
  border: 1px solid ${(props) => (props.theme?.mode === 'dark' ? '#333' : '#e0e0e0')};
  border-radius: 8px;
  padding: 14px 18px;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const AppName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#e0e0e0' : '#212121')};
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 3px 8px;
  border-radius: 4px;
  color: #fff;
  background: ${(props) => props.bg || '#666'};
`;

const DeploymentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 48px;
`;

const DeploymentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${(props) => (props.theme?.mode === 'dark' ? '#1a1a1a' : '#ffffff')};
  border: 1px solid ${(props) => (props.theme?.mode === 'dark' ? '#333' : '#e0e0e0')};
  border-radius: 8px;
  padding: 12px 16px;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  }
`;

const Indicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(props) => props.color || '#666'};
`;

const DeploymentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DeploymentName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#e0e0e0' : '#212121')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeploymentMeta = styled.div`
  font-size: 12px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#808080' : '#999')};
  display: flex;
  gap: 8px;
  margin-top: 2px;
`;

const DeploymentRepo = styled.span`
  color: ${(props) => (props.theme?.mode === 'dark' ? '#ce93d8' : '#9c27b0')};
  font-weight: 500;
`;

const ViewLink = styled.a`
  font-size: 12px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  text-decoration: none;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 48px 0;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#808080' : '#999')};
  font-size: 14px;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 24px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#f48fb1' : '#d32f2f')};
  font-size: 14px;
  background: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(244,143,177,0.08)' : 'rgba(211,47,47,0.05)'};
  border-radius: 8px;
`;

const RefreshBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 12px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#808080' : '#999')};
`;

const RefreshButton = styled.button`
  background: none;
  border: 1px solid ${(props) => (props.theme?.mode === 'dark' ? '#555' : '#ccc')};
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

// ── Helper functions ───────────────────────────────────────────

function formatBytes(bytes) {
  return (Number(bytes) / 1024 ** 3).toFixed(1);
}

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const healthColors = {
  Healthy: '#48bb78',
  Degraded: '#f56565',
  Progressing: '#fbbf24',
};

const syncColors = {
  Synced: '#48bb78',
  OutOfSync: '#fbbf24',
};

const conclusionColors = {
  success: '#48bb78',
  failure: '#f56565',
  cancelled: '#808080',
};

// ── Page Component ─────────────────────────────────────────────

const ClusterPage = () => {
  const { theme } = useTheme();

  // GraphQL query for cluster metrics via Apollo
  const {
    data: metricsData,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery(CLUSTER_METRICS_QUERY);

  // REST state for ArgoCD and GitHub
  const [apps, setApps] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [restErrors, setRestErrors] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Derive cluster data from Apollo response
  const metrics = metricsData?.clusterMetrics;
  const cluster = metrics
    ? {
        totalNodes: metrics.nodeCount,
        totalPods: metrics.totalPods,
        cpuUsage: metrics.cpuUsageCores,
        memoryUsage: metrics.memoryUsageBytes,
      }
    : null;

  const fetchRestData = useCallback(async () => {
    const newErrors = {};

    const results = await Promise.allSettled([
      fetch(`${API_BASE}/api/argocd/applications`).then((r) => r.json()),
      fetch(`${API_BASE}/api/github/runs/recent`).then((r) => r.json()),
    ]);

    if (results[0].status === 'fulfilled') {
      const appData = results[0].value;
      const appList = Array.isArray(appData) ? appData : appData.items || [];
      setApps(
        appList.map((app) => ({
          appName: app.metadata?.name || 'unknown',
          healthStatus: app.status?.health?.status || 'Unknown',
          syncStatus: app.status?.sync?.status || 'Unknown',
        }))
      );
    } else {
      newErrors.apps = results[0].reason?.message || 'Failed to load application status';
    }

    if (results[1].status === 'fulfilled') {
      const runs = results[1].value.workflow_runs || [];
      setDeployments(
        runs.map((run) => ({
          runId: run.id,
          name: run.name,
          repoDisplayName: run.repo_display_name || run.repository?.name || '',
          conclusion: run.conclusion || 'pending',
          htmlUrl: run.html_url || '',
          createdAt: run.created_at,
        }))
      );
    } else {
      newErrors.deployments = results[1].reason?.message || 'Failed to load deployments';
    }

    setRestErrors(newErrors);
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchMetrics(), fetchRestData()]);
    setRefreshing(false);
    setLastRefreshed(new Date());
  }, [refetchMetrics, fetchRestData]);

  // Fetch REST data on mount (Apollo handles its own initial fetch)
  useEffect(() => {
    fetchRestData();
  }, [fetchRestData]);

  const hasCluster = cluster && (cluster.totalNodes || cluster.totalPods);
  const hasApps = apps && apps.length > 0;
  const hasDeployments = deployments && deployments.length > 0;

  return (
    <Layout>
      <PageTransition>
        <SEO
          title="K8s Cluster Dashboard | Jeff Maxwell"
          description="Live Kubernetes cluster status showing application health, resource usage, and recent deployments across the portfolio infrastructure."
          pathname="/cluster/"
        />
        <Container>
          <MotionWrapper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <PageTitle theme={theme}>K8s Cluster</PageTitle>
              <PageSubtitle theme={theme}>
                Live status of the Kubernetes cluster powering the portfolio applications
              </PageSubtitle>
            </div>
          </MotionWrapper>

          <RefreshBar theme={theme}>
            {lastRefreshed && (
              <span>Updated {timeAgo(lastRefreshed.toISOString())}</span>
            )}
            <RefreshButton theme={theme} onClick={refreshData} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </RefreshButton>
          </RefreshBar>

          {/* Cluster Overview */}
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SectionTitle theme={theme}>Cluster Resources</SectionTitle>
            {metricsError ? (
              <ErrorText theme={theme}>{metricsError.message}</ErrorText>
            ) : metricsLoading && !cluster ? (
              <LoadingText theme={theme}>Loading cluster metrics...</LoadingText>
            ) : hasCluster ? (
              <StatsGrid>
                <StatCard theme={theme}>
                  <StatLabel theme={theme}>Nodes</StatLabel>
                  <StatValue theme={theme}>{cluster.totalNodes}</StatValue>
                </StatCard>
                <StatCard theme={theme}>
                  <StatLabel theme={theme}>Pods</StatLabel>
                  <StatValue theme={theme}>{cluster.totalPods}</StatValue>
                </StatCard>
                <StatCard theme={theme}>
                  <StatLabel theme={theme}>CPU Usage</StatLabel>
                  <StatValue theme={theme}>
                    {parseFloat(cluster.cpuUsage).toFixed(1)}
                    <StatUnit theme={theme}>cores</StatUnit>
                  </StatValue>
                  {(() => {
                    const pct = Math.min(
                      (parseFloat(cluster.cpuUsage) / (parseInt(cluster.totalNodes, 10) * 4)) *
                        100,
                      100
                    );
                    return (
                      <>
                        <UsageBarTrack theme={theme}>
                          <UsageBarFill
                            color={theme?.mode === 'dark' ? '#90caf9' : '#1976d2'}
                            percent={pct}
                          />
                        </UsageBarTrack>
                        <UsageDetail theme={theme}>{pct.toFixed(0)}% of capacity</UsageDetail>
                      </>
                    );
                  })()}
                </StatCard>
                <StatCard theme={theme}>
                  <StatLabel theme={theme}>Memory Usage</StatLabel>
                  <StatValue theme={theme}>
                    {formatBytes(cluster.memoryUsage)}
                    <StatUnit theme={theme}>GB</StatUnit>
                  </StatValue>
                  {(() => {
                    const pct = Math.min(
                      (parseFloat(formatBytes(cluster.memoryUsage)) /
                        (parseInt(cluster.totalNodes, 10) * 8)) *
                        100,
                      100
                    );
                    return (
                      <>
                        <UsageBarTrack theme={theme}>
                          <UsageBarFill
                            color={theme?.mode === 'dark' ? '#ce93d8' : '#9c27b0'}
                            percent={pct}
                          />
                        </UsageBarTrack>
                        <UsageDetail theme={theme}>{pct.toFixed(0)}% of capacity</UsageDetail>
                      </>
                    );
                  })()}
                </StatCard>
              </StatsGrid>
            ) : (
              <LoadingText theme={theme}>No cluster metrics available</LoadingText>
            )}
          </MotionWrapper>

          {/* Application Status */}
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SectionTitle theme={theme}>Application Status</SectionTitle>
            {restErrors.apps ? (
              <ErrorText theme={theme}>{restErrors.apps}</ErrorText>
            ) : hasApps ? (
              <AppGrid>
                {apps.map((app) => (
                  <AppRow key={app.appName} theme={theme}>
                    <AppName theme={theme}>{app.appName}</AppName>
                    <BadgeGroup>
                      <Badge bg={healthColors[app.healthStatus] || '#9f7aea'}>
                        {app.healthStatus}
                      </Badge>
                      <Badge bg={syncColors[app.syncStatus] || '#9f7aea'}>
                        {app.syncStatus}
                      </Badge>
                    </BadgeGroup>
                  </AppRow>
                ))}
              </AppGrid>
            ) : (
              <LoadingText theme={theme}>No applications found</LoadingText>
            )}
          </MotionWrapper>

          {/* Recent Deployments */}
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <SectionTitle theme={theme}>Recent Deployments</SectionTitle>
            {restErrors.deployments ? (
              <ErrorText theme={theme}>{restErrors.deployments}</ErrorText>
            ) : hasDeployments ? (
              <DeploymentList>
                {deployments.map((run) => (
                  <DeploymentItem key={run.runId} theme={theme}>
                    <Indicator color={conclusionColors[run.conclusion] || '#fbbf24'} />
                    <DeploymentInfo>
                      <DeploymentName theme={theme}>{run.name}</DeploymentName>
                      <DeploymentMeta theme={theme}>
                        <DeploymentRepo theme={theme}>{run.repoDisplayName}</DeploymentRepo>
                        <span>{timeAgo(run.createdAt)}</span>
                      </DeploymentMeta>
                    </DeploymentInfo>
                    {run.htmlUrl && (
                      <ViewLink
                        theme={theme}
                        href={run.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </ViewLink>
                    )}
                  </DeploymentItem>
                ))}
              </DeploymentList>
            ) : (
              <LoadingText theme={theme}>No recent deployments</LoadingText>
            )}
          </MotionWrapper>
        </Container>
        <div style={{ height: '80px' }} />
      </PageTransition>
    </Layout>
  );
};

export default ClusterPage;
