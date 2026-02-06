import { gql } from '@apollo/client';

export const CLUSTER_METRICS_QUERY = gql`
  query ClusterMetrics {
    clusterMetrics {
      nodeCount
      totalPods
      runningPods
      pendingPods
      failedPods
      namespaceCount
      cpuUsageCores
      memoryUsageBytes
    }
  }
`;
