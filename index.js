const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-dev-middleware');
const merge = require('lodash.merge');
const webpackConfig = require('./webpack.config');

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

function createCompiler(config) {
    return webpack(config);
}

function createDevMiddleware(compiler, config) {
    return webpackDevMiddleware(compiler, {
        noInfo: true,
        quiet: false,
        publicPath: config.output.publicPath,
    });
}

function createHotMiddleware(compiler, config) {
    return webpackHotMiddleware(compiler);
}

function createBuildTask(compiler) {
    return function webpackBuild(done) {
        compiler.run((err, stats) => {
            if (err) throw new Error(err);
            console.log(stats.toString());
            done();
        });
    }
}

function createWatchTask(compiler, callback) {
    compiler.watch({}, (err, stats) => {
        callback(err, stats);
    });
}

module.exports = {
    createBuildTask,
    createConfig,
    createDevMiddleware,
    createHotMiddleware,
    createCompiler,
    createWatchTask,
};
