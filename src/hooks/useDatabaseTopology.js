import { useQuery } from '@apollo/client/react';
import { DATABASE_TOPOLOGY_QUERY } from '../graphql/gateway';

const POLL_INTERVAL_MS = 30000;

export default function useDatabaseTopology() {
  const { data, loading, error } = useQuery(DATABASE_TOPOLOGY_QUERY, {
    pollInterval: POLL_INTERVAL_MS,
  });
  const topology = data?.databaseTopology || null;

  return {
    topology,
    loading: loading && !topology,
    error: error && !topology ? error : null,
  };
}
