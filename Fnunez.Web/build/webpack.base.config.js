const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Path = require('path');
const IsProductionMode = Boolean(process.env.WEBPACK_MODE) && process.env.WEBPACK_MODE == 'production';
// Try the environment variable, otherwise use root for windows '' and linux '/', or just use 'auto' and webpack take care about it
const AssetPath = Boolean(process.env.ASSET_PATH) ? process.env.ASSET_PATH : 'auto';

module.exports = {
    entry: './src/app',
    output: {
        path: Path.resolve(__dirname, '../dist'),
        filename: 'app.[contenthash:8].js',
        publicPath: AssetPath,
        clean: true,
        assetModuleFilename: 'assets/[hash][ext][query]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Nunez.ninja',
            template: './src/index.html',
            inject: "body",
            minify: {
                removeComments: IsProductionMode,
                collapseWhitespace: IsProductionMode
            },
        }),
        new HtmlWebpackPlugin({
            title: 'Nunez.ninja',
            template: './src/portfolio-details-1.html',
            inject: "body",
            minify: {
                removeComments: IsProductionMode,
                collapseWhitespace: IsProductionMode
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
            '@css': Path.resolve(__dirname, '../src/assets/css'),
            '@fonts': Path.resolve(__dirname, '../src/assets/fonts'),
            '@images': Path.resolve(__dirname, '../src/assets/images'),
            '@js': Path.resolve(__dirname, '../src/assets/js'),
            '@': Path.resolve(__dirname, '../src')
        },
        modules: [
            'node_modules',
            Path.resolve(__dirname, '../src')
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
            //Single bundle = css + js files
            // {
            //     test: /\.(sa|sc|c)ss$/,
            //     use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            // },
            //Separated bundle css and js
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            publicPath: AssetPath,
                        },
                    },
                    'css-loader',
                    "postcss-loader",
                    "sass-loader",
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
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
                            // The `resourcePath` argument contains a Path to the loaded HTML file.

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
