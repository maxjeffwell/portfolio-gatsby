import { useQuery } from '@apollo/client/react';
import { LLM_TOPOLOGY_QUERY } from '../graphql/gateway';

const POLL_INTERVAL_MS = 30000;

export default function useLlmTopology() {
  const { data, loading, error } = useQuery(LLM_TOPOLOGY_QUERY, {
    pollInterval: POLL_INTERVAL_MS,
  });
  const topology = data?.llmTopology || null;

  return {
    topology,
    loading: loading && !topology,
    error: error && !topology ? error : null,
  };
}
