import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getCookie } from "cookies-next";
import Router from "next/router";

const token = getCookie("user");

const httpLink = new HttpLink({
  uri: "http://localhost:8080/query",
  headers: token
    ? {
        Authorization: "bearer " + token,
      }
    : {},
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (networkError) {
      if (networkError.name == "TypeError") {
        alert("Backend is down\n" + "Network Error: " + networkError.message);
        Router.reload();
      }
    }
  }
);

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
