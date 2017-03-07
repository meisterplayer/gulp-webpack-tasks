const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const merge = require('lodash.merge');

function createConfig(inPath, outPath, minify = false, webpackOptions = {}) {
    if (!inPath) {
        throw new Error('Input path argument is required');
    }

    if (!outPath) {
        throw new Error('Output path argument is required');
    }

    const newWebpackConfig = merge({}, webpackConfig, webpackOptions);

    newWebpackConfig.entry[0] = inPath;
    newWebpackConfig.output.filename = outPath;

    newWebpackConfig.plugins = (minify ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
        })
    ] : []);

    return newWebpackConfig;
}

function createBuildTask(config) {
    return function webpackBuild(done) {
        webpack(config, (err, stats) => {
            if (err) throw new Error(err);
            done(stats);
        });
    }
}

module.exports = {
    createBuildTask,
    createConfig
};
