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
      totalCpuCores
      totalMemoryBytes
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
      totalCpuCores
      totalMemoryBytes
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

const NETWORK_TOPOLOGY_FIELDS = `
  nodes {
    id
    hostname
    displayName
    type
    zone
    wireguardIp
    health
    services {
      name
      status
      port
    }
    metrics {
      cpuPercent
      memoryPercent
      memoryUsedMb
      memoryTotalMb
      storageUsedGb
      storageTotalGb
      uptime
    }
  }
  links {
    source
    target
    type
    status
    bandwidthBps
    latencyMs
    metadata {
      lastHandshake
      via
      transferRxBytes
      transferTxBytes
      targetIqn
      partitionsShared
      exportPath
      mountPoint
    }
  }
  lastUpdated
`;

export const NETWORK_TOPOLOGY_QUERY = gql`
  query NetworkTopology {
    networkTopology {
      ${NETWORK_TOPOLOGY_FIELDS}
    }
  }
`;

export const NETWORK_TOPOLOGY_SUBSCRIPTION = gql`
  subscription NetworkTopologyStream {
    networkTopologyStream {
      ${NETWORK_TOPOLOGY_FIELDS}
    }
  }
`;

export const DATABASE_TOPOLOGY_QUERY = gql`
  query DatabaseTopology {
    databaseTopology {
      apps {
        id
        displayName
        databases
      }
      databases {
        id
        displayName
        engine
        manager
        health
        expectedInstances
        instances {
          name
          role
          machineId
          machineName
          ready
        }
        storage
        backups {
          name
          target
          status
          lastSuccess
        }
      }
      lastUpdated
    }
  }
`;

export const DNS_TOPOLOGY_QUERY = gql`
  query DnsTopology {
    dnsTopology {
      resolvers {
        id
        displayName
        location
        role
        health
        stat
      }
      clients {
        id
        displayName
        detail
      }
      nameKinds {
        id
        label
        example
      }
      paths {
        client
        nameKind
        resolves
        summary
        hops {
          from
          to
          note
          fallback
        }
      }
      lastUpdated
    }
  }
`;

export const MONITORING_TOPOLOGY_QUERY = gql`
  query MonitoringTopology {
    monitoringTopology {
      stages {
        id
        label
      }
      nodes {
        id
        stage
        displayName
        location
        role
        health
        stat
        inferred
      }
      flows {
        from
        to
        signal
        note
      }
      lastUpdated
    }
  }
`;
