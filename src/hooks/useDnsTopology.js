import { useQuery } from '@apollo/client/react';
import { DNS_TOPOLOGY_QUERY } from '../graphql/gateway';

const POLL_INTERVAL_MS = 30000;

export default function useDnsTopology() {
  const { data, loading, error } = useQuery(DNS_TOPOLOGY_QUERY, { pollInterval: POLL_INTERVAL_MS });
  const topology = data?.dnsTopology || null;

  return {
    topology,
    loading: loading && !topology,
    error: error && !topology ? error : null,
  };
}
