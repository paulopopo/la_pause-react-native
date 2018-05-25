import React from 'react';
import { AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-client-preset';
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';

import { TOKEN_KEY, HOST, WS_HOST } from './constants';

import Routes from './src/routes';


const wsLink = new WebSocketLink({
    uri: `wss://lapause-onwnwpqbon.now.sh/`,
    options: {
        reconnect: true,
    },
});

const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});



const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(createUploadLink({ uri: `https://lapause-onwnwpqbon.now.sh/` })),
)

// apollo client setup
const client = new ApolloClient({
    link: ApolloLink.from([link]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
})

console.log("Hello react native");

export default class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <Routes />
            </ApolloProvider>)
    }
}