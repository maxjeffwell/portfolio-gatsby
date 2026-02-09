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

export const ARGOCD_APPS_QUERY = gql`
  query ArgoCDApplications {
    argoCDApplications {
      name
      healthStatus
      syncStatus
    }
  }
`;

export const ARGOCD_APPS_SUBSCRIPTION = gql`
  subscription ArgoCDAppsStream {
    argoCDAppsStream {
      name
      healthStatus
      syncStatus
    }
  }
`;

export const GITHUB_RUNS_QUERY = gql`
  query RecentGitHubRuns {
    recentGitHubRuns {
      runId
      name
      repo
      repoDisplayName
      conclusion
      htmlUrl
      createdAt
    }
  }
`;

export const GITHUB_RUNS_SUBSCRIPTION = gql`
  subscription GitHubRunsStream {
    githubRunsStream {
      runId
      name
      repo
      repoDisplayName
      conclusion
      htmlUrl
      createdAt
    }
  }
`;

export const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($input: ContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`;
