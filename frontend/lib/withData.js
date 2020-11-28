// import withApollo from "next-with-apollo";
// import { endpoint, prodEndpoint } from "../config";
// import { createPersistedQueryLink } from "apollo-link-persisted-queries";
// import { ApolloClient } from "apollo-client";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { HttpLink, createHttpLink } from "apollo-link-http";
// import { onError } from "apollo-link-error";
// import { ApolloLink } from "apollo-link";
// import { ApolloLink, HttpLink, from, split, execute } from "@apollo/client";
// import { ApolloClient, InMemoryCache } from "@apollo/client";

// const cache = new InMemoryCache();

// function createClient({ headers }) {
//   return new ApolloClient({
//     uri: prodEndpoint,
//     cache: new InMemoryCache(),
//   });
// }

// function createClient({ headers }) {
//   return new ApolloClient({
//     cache,
//     link: ApolloLink.from([
//       onError(({ graphQLErrors, networkError }) => {
//         if (graphQLErrors)
//           graphQLErrors.forEach(({ message, locations, path }) =>
//             console.log(
//               `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//             )
//           );
//         if (networkError) console.log(`[Network error]: ${networkError}`);
//       }),
//       new HttpLink({
//         uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
//         credentials: "include",
//         headers,
//       }),
//     ]),
//   });
// }

// export default withApollo(createClient);

import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/link-error";
import { getDataFromTree } from "@apollo/react-ssr";
import { createUploadLink } from "apollo-upload-client";
import withApollo from "next-with-apollo";
import { endpoint, prodEndpoint } from "../config";
// import paginationField from "./paginationField";

function createClient({ headers, initialState }) {
  console.log("Here 1");
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError)
          console.log(
            `[Network error]: ${networkError}. Backend is unreachable. Is it running?`
          );
      }),
      // this uses apollo-link-http under the hood, so all the options here come from that package
      createUploadLink({
        // uri: process.env.NODE_ENV === "development" ? endpoint : prodEndpoint,
        uri: endpoint,
        fetchOptions: {
          credentials: "include",
        },
        // pass the headers along from this request. This enables SSR with logged in state
        headers,
      }),
    ]),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default withApollo(createClient, { getDataFromTree });
