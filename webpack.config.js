const cwd = process.cwd();
const path = require('path');

const MODULE_NAME = 'bundle';

module.exports = {
    devtool: 'source-map',
    resolve: {
        extensions: ['.js'],
    },
    entry: [
        './index',
    ],
    output: {
        path: cwd,
        libraryTarget: 'commonjs2',
        filename: `${MODULE_NAME}.js`,
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url-loader',
                options: {
                    limit: 100000,
                },
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader?sourceMap',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'base64-font-loader',
            },
        ],
    },
};
