const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const withLess = require("@zeit/next-less");
module.exports = {
    sassOptions: withCSS(
        withSass({
            ...withLess({
                lessLoaderOptions: {
                    javascriptEnabled: true,
                    importLoaders: 0,
                },
                cssLoaderOptions: {
                    importLoaders: 3,
                },
            }),
            webpack: (config, options) => {
                config.module.rules.push(
                    // Images
                    {
                        test: /\.(jpe?g|png|svg|gif|ico|webp|jp2)$/,
                        exclude: config.exclude,
                        use: [
                            {
                                loader: require.resolve("url-loader"),
                                options: {
                                    limit: config.inlineImageLimit,
                                    fallback: require.resolve("file-loader"),
                                    publicPath: `${config.assetPrefix}/_next/static/images/`,
                                    outputPath: `${
                                        options.isServer ? "../" : ""
                                    }static/images/`,
                                    name: "[name]-[hash].[ext]",
                                    esModule: config.esModule || false,
                                },
                            },
                        ],
                    },
                    // Fonts
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/,
                        use: [
                            {
                                loader: require.resolve("url-loader"),
                                options: {
                                    limit: 8192,
                                    fallback: require.resolve("file-loader"),
                                    publicPath: `/_next/static/fonts/`,
                                    outputPath: `${
                                        options.isServer ? "../" : ""
                                    }static/fonts/`,
                                    name: "[name]-[hash].[ext]",
                                },
                            },
                        ],
                    }
                );
                // Global SASS variables
                config.module.rules.map((rule) => {
                    const { test } = rule;

                    if (test && (test.test(".scss") || test.test(".sass"))) {
                        rule.use.push({
                            loader: "sass-resources-loader",
                            options: {
                                resources: ["./styles/_variables.scss"],
                            },
                        });
                    }
                });

                return config;
            },
            // cssModules: true
            /* sassLoaderOptions: {
        includePaths: ["~bootstrap/scss/bootstrap-grid.scss"]
    } */
        })
    ),
};
