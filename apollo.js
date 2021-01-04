// import { useMemo } from "react";
import { ApolloClient } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";
import { InMemoryCache } from "@apollo/client";
export let cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? "https://api.loaloa.tech/admin/api"
      : "https://api.loaloa.tech/admin/api",
  credentials: "same-origin",
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache,
  });
}

let apolloClient;
export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  return _apolloClient;
}
// export function useApollo(initialState) {
//   const store = useMemo(() => {
//     return initializeApollo(initialState);
//   }, [initialState]);
//   return store;
// }
