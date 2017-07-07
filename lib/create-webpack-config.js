const cwd = process.cwd();
const path = require('path');
const merge = require('lodash.merge');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const MODULE_NAME = 'bundle';

const initialOptions = {
    minify: false,
    cssInjection: false,
}

const createWebpackConfig = (entry, outputPath, opts = initialOptions) => {
    const options = merge({}, initialOptions, opts);
    console.log(options);

    return {
        devtool: options.minify && 'source-map',
        context: cwd,
        resolve: {
            extensions: ['.js'],
        },
        entry: [entry],
        output: {
            path: cwd,
            libraryTarget: 'commonjs2',
            filename: outputPath || `${MODULE_NAME}.js`,
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
                    test: /\.s?css$/,
                    loaders: ExtractTextWebpackPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'sass-loader',
                        ],
                    }),
                },
                {
                    test: /\.(woff|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'base64-font-loader',
                },
            ],
        },
        plugins: [
            options.minify && new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
            }),
            new ExtractTextWebpackPlugin({
                filename: path.dirname(outputPath) + '/styles.css',
                disable: options.cssInjection, // disable the file seperation and use style-loader instead
            }),
        ].filter(Boolean),
    };
};

module.exports = createWebpackConfig;
