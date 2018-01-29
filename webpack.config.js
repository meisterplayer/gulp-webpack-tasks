const cwd = process.cwd();
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const MODULE_NAME = 'bundle';

module.exports = (opts = {}) => {
    const cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                localIdentName: 'mstr-[folder]-[local]',
            },
        },
        'sass-loader',
    ];

    return {
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
                    test: /\.(jpe?g|png|gif)$/i,
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                    },
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.scss$/,
                    loaders: opts.cssFilename? ExtractTextWebpackPlugin.extract({
                        use: cssLoaders,
                    }) : ['style-loader?sourceMap'].concat(cssLoaders),
                },
                {
                    test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'base64-font-loader',
                },
            ],
        },
        plugins: [
            opts.cssFilename && new ExtractTextWebpackPlugin(opts.cssFilename),
        ].filter(Boolean),
    };
}
