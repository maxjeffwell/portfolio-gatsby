import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GATEWAY_URL =
  process.env.GATSBY_GATEWAY_URL || 'https://gateway.el-jefe.me/graphql';

const client = new ApolloClient({
  link: new HttpLink({ uri: GATEWAY_URL }),
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
