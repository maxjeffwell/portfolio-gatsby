import { useQuery, useSubscription } from '@apollo/client/react';
import {
  NETWORK_TOPOLOGY_QUERY,
  NETWORK_TOPOLOGY_SUBSCRIPTION,
} from '../graphql/gateway';

export default function useNetworkTopology() {
  const { data: queryData, loading, error } = useQuery(NETWORK_TOPOLOGY_QUERY);

  const { data: subData } = useSubscription(NETWORK_TOPOLOGY_SUBSCRIPTION);

  const topology =
    subData?.networkTopologyStream || queryData?.networkTopology || null;

  return {
    topology,
    loading: loading && !topology,
    error: error && !topology ? error : null,
    lastUpdated: topology?.lastUpdated || null,
  };
}
