/* eslint-disable no-undef */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const config = require('./internals/config.js')();

// Output base directory
const outputPath = path.join(__dirname, config.outputPath);

// static prefix where the static files will be served on the webserver
// Eg: /static/ will be: http://localhost:7000/static/js/index.js
const staticPath = config.staticPath;

// Root app directory
const context = path.join(__dirname, config.rootFolder);

module.exports = [{
    name: 'js',
    devtool: 'source-map',
    context: context,
    entry: {
        index: [
            './index.js',
        ],
    },
    output: {
        path: outputPath + '/js',
        filename: '[name].js',
        publicPath: staticPath,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ],
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
},
{
    name: 'vendor',
    context: context,
    entry: {
        vendor: './vendor.js',
    },
    output: {
        path: outputPath + '/js',
        filename: 'vendor.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'img/**',
                to: outputPath
            },
            {
                from: 'fonts/**',
                to: outputPath
            }
        ]),
    ],
},
{
    name: 'style',
    devtool: 'source-map',
    context: context,
    entry: {
        styles: [
            './scss/index.scss',
        ],
    },
    output: {
        path: outputPath + '/css',
        filename: 'index.css',
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/,
                exclude: /fonts/,
                loader: 'file?name=[path][name].[ext]',
            },
            {
                test: /\.(woff|woff2|ttf|eot|otf|svg)$/,
                exclude: /img/,
                loader: 'file?name=[path][name].[ext]',
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'index.css',
            disable: false,
            allChunks: true,
        }),

    ],
}
];
/* eslint-enable */
