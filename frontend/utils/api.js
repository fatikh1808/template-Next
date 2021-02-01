import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
    gql,
} from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({
        uri: `${
            process.env.NEXT_PUBLIC_STRAPI_API_URL ||
            "http://localhost:1337/graphql"
        }`,
    }),
    cache: new InMemoryCache(),
});

// client
//     .query({
//         query: gql`
//             query pages {
//                 pages {
//                     id
//                 }
//             }
//         `,
//     })
//     .then((result) => console.log("pages", result));

export function getStrapiURL(path) {
    console.log("path", path);
    return `${
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
    }${path}`;
}

// Helper to make GET requests to Strapi
export async function fetchAPI(path) {
    const requestUrl = getStrapiURL(path);
    console.log("request_url", requestUrl);
    const response = await fetch(requestUrl);
    const data = await response.json();
    console.log("requested_data", data);
    return data;
}

export async function getPageData(slug, preview = false) {
    // Find the pages that match this slug
    const pagesData = await fetchAPI(
        `/pages?slug=${slug}&status=published${preview ? "&status=draft" : ""}`
    );

    // Make sure we found something, otherwise return null
    if (pagesData == null || pagesData.length === 0) {
        return null;
    }

    // Return the first item since there should only be one result per slug
    return pagesData[0];
}

// Get site data from Strapi (metadata, navbar, footer...)
export async function getGlobalData() {
    const global = await fetchAPI("/global");
    return global;
}
