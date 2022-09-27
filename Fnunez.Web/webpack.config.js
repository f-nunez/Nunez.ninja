const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/app',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.[contenthash:8].js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            '@css': path.resolve(__dirname, 'src/assets/css'),
            '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
            '@images': path.resolve(__dirname, 'src/assets/images'),
            '@js': path.resolve(__dirname, 'src/assets/js'),
            '@': path.resolve(__dirname, 'src')
        },
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
        extensions: [".js", ".ts"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Nunez.ninja',
            template: './src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'app.[contenthash:8].css',
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ],
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
                test: [/.css$|.scss$/],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'assets/'
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                    noquotes: true
                }
            }
        ]
    }
}
