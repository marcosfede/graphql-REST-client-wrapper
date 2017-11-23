import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

import { ApolloClient}  from "apollo-client"
import { ApolloProvider } from "react-apollo"
import { ApolloLink, Observable } from 'apollo-link';
// import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import {schema} from './graphql/schema'
import { execute } from 'graphql'


class LocalLink extends ApolloLink {
  constructor(schema, context, rootValue) {
    super();

    this.schema = schema;
    this.context = context;
    this.rootValue = rootValue;
  }

  request(operation) {
    const { schema, rootValue, context } = this;
    const { query, variables, operationName } = operation;

    return new Observable(observer => {
      let canceled = false;

      execute(schema, query, rootValue, context, variables, operationName)
        .then(result => {
          if (canceled) {
            return;
          }
          // we have data and can send it to back up the link chain
          observer.next(result);
          observer.complete();
          return result;
        })
        .catch(err => {
          if (canceled) {
            return;
          }

          observer.error(err);
        });

        return () => {
          canceled = true;
        };
    });
  }
}

const client = new ApolloClient({
  // link: new HttpLink({
  //   uri: "http://localhost:8000/graphql/"
  // }),
  link: new LocalLink(schema),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
)
