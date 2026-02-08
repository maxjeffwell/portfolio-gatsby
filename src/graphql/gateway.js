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

export const CLUSTER_METRICS_SUBSCRIPTION = gql`
  subscription ClusterMetricsStream {
    clusterMetricsStream {
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

export const RECENT_AI_EVENTS_QUERY = gql`
  query RecentAIEvents {
    recentAIEvents {
      eventId
      timestamp
      endpoint
      app
      backend
      model
      status
      latencyMs
      usage {
        promptTokens
        completionTokens
      }
      fromCache
    }
  }
`;

export const AI_EVENT_SUBSCRIPTION = gql`
  subscription AIEventStream {
    aiEventStream {
      eventId
      timestamp
      endpoint
      app
      backend
      model
      status
      latencyMs
      usage {
        promptTokens
        completionTokens
      }
      fromCache
    }
  }
`;
