import App from "next/app";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { getGlobalData } from "utils/api";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
} from "@apollo/client";

import { i18n, withTranslation } from "../i18n";
import { appWithTranslation } from "../i18n";

import "../styles/index.css";

const client = new ApolloClient({
    link: new HttpLink({
        uri: "https://gql-test.serafim.help/v1/graphql",
        headers: {
            "x-hasura-admin-secret": "password-for-hasura-test",
        },
    }),
    cache: new InMemoryCache(),
});

// client
//     .query({
//         query: gql`
//             query GetRates {
//                 news {
//                     category_id
//                 }
//             }
//         `,
//     })
//     .then((result) => console.log("news", result));

const MyApp = ({ Component, pageProps, t }) => {
    return (
        <ApolloProvider client={client}>
            <Component {...pageProps} />
        </ApolloProvider>
    );
};

export default appWithTranslation(withTranslation("common")(MyApp));
