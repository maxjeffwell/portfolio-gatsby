import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const GATEWAY_URL =
  process.env.GATSBY_GATEWAY_URL || 'https://gateway.el-jefe.me/graphql';

const WS_URL = GATEWAY_URL.replace(/^https/, 'wss').replace(/^http/, 'ws');

const httpLink = new HttpLink({ uri: GATEWAY_URL });

// WebSocket link for subscriptions (browser only - not available during SSR/build)
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: WS_URL,
          retryAttempts: 5,
          shouldRetry: () => true,
        }),
      )
    : null;

const link =
  typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
          );
        },
        wsLink,
        httpLink,
      )
    : httpLink;

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

export default client;
