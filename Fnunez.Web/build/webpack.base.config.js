const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    entry: './src/app',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'app.[contenthash:8].js',
        publicPath: './',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Nunez.ninja',
            template: './src/index.html',
            inject: "body",
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
        }),
        new HtmlWebpackPlugin({
            title: 'Nunez.ninja',
            template: './src/portfolio-details-1.html',
            inject: "body",
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            filename: './portfolio-details-1.html'
        }),
        new MiniCssExtractPlugin({
            filename: "app.[contenthash:8].css",
            chunkFilename: "[id].css",
        })
    ],
    resolve: {
        alias: {
            '@css': path.resolve(__dirname, '../src/assets/css'),
            '@fonts': path.resolve(__dirname, '../src/assets/fonts'),
            '@images': path.resolve(__dirname, '../src/assets/images'),
            '@js': path.resolve(__dirname, '../src/assets/js'),
            '@': path.resolve(__dirname, '../src')
        },
        modules: [
            'node_modules',
            path.resolve(__dirname, '../src')
        ],
        extensions: [".js", ".ts"],
    },
    module: {
        rules: [
            {
                test: [/.js$|.ts$/],
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/typescript',
                            '@babel/preset-env'
                        ]
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                //Single bundle = css + js files
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                //Separated bundle
                // use: [
                //     {
                //         loader: MiniCssExtractPlugin.loader,
                //         options: {
                //             // you can specify a publicPath here
                //             // by default it uses publicPath in webpackOptions.output
                //             publicPath: "./",
                //         },
                //     },
                //     'css-loader',
                //     "postcss-loader",
                //     "sass-loader",
                // ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    sources: {
                        list: [
                            // All default supported tags and attributes
                            "...",
                            {
                                tag: "a",
                                attribute: "href",
                                // Type of processing, can be `src` or `scrset`
                                type: "src",
                                // Allow to filter some attributes
                                filter: (tag, attribute, attributes, resourcePath) => {
                                    // The `tag` argument contains a name of the HTML tag.
                                    // The `attribute` argument contains a name of the HTML attribute.
                                    // The `attributes` argument contains all attributes of the tag.
                                    // The `resourcePath` argument contains a path to the loaded HTML file.

                                    if (/stylesheet/i.test(attributes.rel)) {
                                        return true;
                                    }

                                    if (
                                        attributes.type &&
                                        attributes.type.trim().toLowerCase() !== "text/css"
                                    ) {
                                        return false;
                                    }

                                    return true;
                                },
                            },
                        ],
                        urlFilter: (attribute, value, resourcePath) => {
                            // The `attribute` argument contains a name of the HTML attribute.
                            // The `value` argument contains a value of the HTML attribute.
                            // The `resourcePath` argument contains a path to the loaded HTML file.

                            if (/index\.html$/.test(value)) {
                                return false;
                            }

                            if (/portfolio-details-1\.html$/.test(value)) {
                                return false;
                            }

                            return true;
                        },
                    },
                },
            }
        ]
    }
}
