import App from "next/app";
import Head from "next/head";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import { getStrapiMedia } from "utils/media";
import { getStrapiURL, getGlobalData } from "utils/api";
import Layout from "@/components/layout";
import "@/styles/index.scss";
// import "rsuite/lib/styles/index.less"; // or 'rsuite/dist/styles/rsuite-default.css'
import { Button } from "rsuite";
import { gql } from "@apollo/client";
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    HttpLink,
} from "@apollo/client";
import { i18n, withTranslation } from "../i18n";
import { appWithTranslation } from "../i18n";

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
    // Prevent Next bug when it tries to render the [[...slug]] route

    const router = useRouter();
    if (router.asPath === "/[[...slug]]") {
        return null;
    }

    // Extract the data we need
    const { global } = pageProps;
    if (global == null) {
        return <ErrorPage statusCode={404} />;
    }
    const { metadata } = global;

    console.log("soooooooqaaaa", process.env.customKey);

    return (
        <ApolloProvider client={client}>
            <>
                {/* Favicon */}
                <Head>
                    <link
                        rel="shortcut icon"
                        href={getStrapiMedia(global.favicon.url)}
                    />
                </Head>
                {/* Global site metadata */}
                <DefaultSeo
                    titleTemplate={`%s | ${global.metaTitleSuffix}`}
                    title={"Page"}
                    description={metadata.metaDescription}
                    openGraph={{
                        images: Object.values(metadata.shareImage.formats).map(
                            (image) => {
                                return {
                                    url: getStrapiMedia(image.url),
                                    width: image.width,
                                    height: image.height,
                                };
                            }
                        ),
                    }}
                    twitter={{
                        cardType: metadata.twitterCardType,
                        handle: metadata.twitterUsername,
                    }}
                />
                {/* Display the content */}
                <Layout global={global}>
                    <Button
                        onClick={() =>
                            i18n.changeLanguage(
                                i18n.language === "en" ? "de" : "en"
                            )
                        }
                        appearance="primary"
                    >
                        {t("change-locale")}
                    </Button>
                    <Component {...pageProps} />
                    <Button
                        appearance="primary"
                        onClick={() =>
                            i18n.changeLanguage(
                                i18n.language === "en" ? "de" : "en"
                            )
                        }
                    >
                        {t("change-locale")}
                    </Button>
                </Layout>
            </>
        </ApolloProvider>
    );
};

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx) => {
    // Calls page's `getInitialProps` and fills `appProps.pageProps`
    const appProps = await App.getInitialProps(ctx);
    // Fetch global site settings from Strapi
    const global = await getGlobalData();
    // Pass the data to our page via props
    return { ...appProps, pageProps: { global, path: ctx.pathname } };
};

export default appWithTranslation(withTranslation("common")(MyApp));
