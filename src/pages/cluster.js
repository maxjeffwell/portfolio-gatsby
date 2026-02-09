import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useQuery, useSubscription } from '@apollo/client/react';
import { useTheme } from '../context/ThemeContext';
import {
  CLUSTER_METRICS_QUERY,
  CLUSTER_METRICS_SUBSCRIPTION,
  ARGOCD_APPS_QUERY,
  ARGOCD_APPS_SUBSCRIPTION,
  GITHUB_RUNS_QUERY,
  GITHUB_RUNS_SUBSCRIPTION,
} from '../graphql/gateway';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PageTransition from '../components/PageTransition';
import MotionWrapper from '../components/MotionWrapper';
import AIEventFeed from '../components/AIEventFeed';

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
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 700;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#333')};
  margin-bottom: 20px;
  letter-spacing: -0.5px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 48px;
`;

const StatCard = styled.div`
  background: ${(props) =>
    props.theme?.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(26,26,26,0.9) 0%, rgba(30,30,50,0.9) 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f5f7ff 100%)'};
  border: 1px solid ${(props) => (props.theme?.mode === 'dark' ? '#333' : '#e0e0e0')};
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    transform: translateY(-4px);
    box-shadow: ${(props) =>
      props.theme?.mode === 'dark'
        ? '0 8px 32px rgba(144,202,249,0.15)'
        : '0 8px 32px rgba(25,118,210,0.12)'};
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1565c0')};
  margin-bottom: 10px;
  font-weight: 600;
`;

const StatValue = styled.div`
  font-size: clamp(36px, 5vw, 48px);
  font-weight: 800;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#ffffff' : '#212121')};
  line-height: 1;
`;

const StatUnit = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#b0b0b0' : '#666')};
  margin-left: 4px;
`;

const UsageBarTrack = styled.div`
  height: 8px;
  background: ${(props) => (props.theme?.mode === 'dark' ? '#333' : '#e0e0e0')};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 14px;
`;

const UsageBarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${(props) => props.color || '#1976d2'};
  width: ${(props) => props.percent || 0}%;
  box-shadow: 0 0 12px ${(props) => (props.color || '#1976d2')}66;
`;

const UsageDetail = styled.div`
  font-size: 14px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#a0a0a0' : '#666')};
  margin-top: 8px;
  font-weight: 500;
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
  border-radius: 12px;
  padding: 18px 22px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.theme?.mode === 'dark'
        ? '0 4px 20px rgba(144,202,249,0.1)'
        : '0 4px 20px rgba(25,118,210,0.08)'};
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const AppName = styled.span`
  font-size: 16px;
  font-weight: 700;
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
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 5px 12px;
  border-radius: 6px;
  color: #fff;
  background: ${(props) => props.bg || '#666'};
  box-shadow: 0 2px 8px ${(props) => (props.bg || '#666')}44;
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
  gap: 14px;
  background: ${(props) => (props.theme?.mode === 'dark' ? '#1a1a1a' : '#ffffff')};
  border: 1px solid ${(props) => (props.theme?.mode === 'dark' ? '#333' : '#e0e0e0')};
  border-radius: 12px;
  padding: 16px 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
    transform: translateX(4px);
  }
`;

const Indicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(props) => props.color || '#666'};
  box-shadow: 0 0 8px ${(props) => (props.color || '#666')}88;
`;

const DeploymentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DeploymentName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#e0e0e0' : '#212121')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeploymentMeta = styled.div`
  font-size: 13px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#808080' : '#999')};
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const DeploymentRepo = styled.span`
  color: ${(props) => (props.theme?.mode === 'dark' ? '#ce93d8' : '#9c27b0')};
  font-weight: 500;
`;

const ViewLink = styled.a`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#90caf9' : '#1976d2')};
  text-decoration: none;
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(144,202,249,0.08)' : 'rgba(25,118,210,0.06)'};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.theme?.mode === 'dark' ? 'rgba(144,202,249,0.16)' : 'rgba(25,118,210,0.12)'};
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 48px 0;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#808080' : '#999')};
  font-size: 16px;
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 24px;
  color: ${(props) => (props.theme?.mode === 'dark' ? '#f48fb1' : '#d32f2f')};
  font-size: 15px;
  background: ${(props) =>
    props.theme?.mode === 'dark' ? 'rgba(244,143,177,0.08)' : 'rgba(211,47,47,0.05)'};
  border-radius: 12px;
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #48bb78;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #48bb78;
  box-shadow: 0 0 6px #48bb78;
  animation: ${pulse} 2s infinite;
  display: inline-block;
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

// ── Client-only Dashboard (all data via GraphQL subscriptions) ──

const ClusterDashboard = ({ theme }) => {
  // Cluster metrics: subscription (30s) with query fallback
  const { data: subMetrics } = useSubscription(CLUSTER_METRICS_SUBSCRIPTION);
  const { data: queryMetrics, loading: metricsLoading, error: metricsError } =
    useQuery(CLUSTER_METRICS_QUERY);
  const metrics = subMetrics?.clusterMetricsStream || queryMetrics?.clusterMetrics;

  // ArgoCD apps: subscription (60s) with query fallback
  const { data: subApps } = useSubscription(ARGOCD_APPS_SUBSCRIPTION);
  const { data: queryApps, loading: appsLoading, error: appsError } =
    useQuery(ARGOCD_APPS_QUERY);
  const apps = subApps?.argoCDAppsStream || queryApps?.argoCDApplications || [];

  // GitHub runs: subscription (60s) with query fallback
  const { data: subRuns } = useSubscription(GITHUB_RUNS_SUBSCRIPTION);
  const { data: queryRuns, loading: runsLoading, error: runsError } =
    useQuery(GITHUB_RUNS_QUERY);
  const deployments = subRuns?.githubRunsStream || queryRuns?.recentGitHubRuns || [];

  const cluster = metrics
    ? {
        totalNodes: metrics.nodeCount,
        totalPods: metrics.totalPods,
        cpuUsage: metrics.cpuUsageCores,
        memoryUsage: metrics.memoryUsageBytes,
        totalCpuCores: metrics.totalCpuCores,
        totalMemoryBytes: metrics.totalMemoryBytes,
      }
    : null;

  const hasCluster = cluster && (cluster.totalNodes || cluster.totalPods);
  const hasApps = apps.length > 0;
  const hasDeployments = deployments.length > 0;

  return (
    <>
      {/* Cluster Overview */}
      <MotionWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SectionTitle theme={theme}>Cluster Resources</SectionTitle>
        {metricsError && !metrics ? (
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
                const pct = cluster.totalCpuCores
                  ? Math.min(
                      (parseFloat(cluster.cpuUsage) / cluster.totalCpuCores) * 100,
                      100
                    )
                  : 0;
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
                const pct = cluster.totalMemoryBytes
                  ? Math.min(
                      (cluster.memoryUsage / cluster.totalMemoryBytes) * 100,
                      100
                    )
                  : 0;
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
        {appsError && !hasApps ? (
          <ErrorText theme={theme}>{appsError.message}</ErrorText>
        ) : appsLoading && !hasApps ? (
          <LoadingText theme={theme}>Loading application status...</LoadingText>
        ) : hasApps ? (
          <AppGrid>
            {apps.map((app) => (
              <AppRow key={app.name} theme={theme}>
                <AppName theme={theme}>{app.name}</AppName>
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
        {runsError && !hasDeployments ? (
          <ErrorText theme={theme}>{runsError.message}</ErrorText>
        ) : runsLoading && !hasDeployments ? (
          <LoadingText theme={theme}>Loading recent deployments...</LoadingText>
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

      {/* AI Gateway Activity */}
      <MotionWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <SectionTitle theme={theme}>AI Gateway Activity</SectionTitle>
        <AIEventFeed theme={theme} />
      </MotionWrapper>
    </>
  );
};

// ── Page Component (SSR-safe) ───────────────────────────────────

const ClusterPage = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
              {isClient && (
                <LiveBadge>
                  <LiveDot /> Live
                </LiveBadge>
              )}
            </div>
          </MotionWrapper>

          {isClient ? (
            <ClusterDashboard theme={theme} />
          ) : (
            <LoadingText theme={theme}>Loading cluster dashboard...</LoadingText>
          )}
        </Container>
        <div style={{ height: '80px' }} />
      </PageTransition>
    </Layout>
  );
};

export default ClusterPage;
