/* eslint-disable */
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const merge = require('lodash.merge');
const createWebpackConfig = require('./webpack.config');

function createOutputConfig(outputOptions) {
    const webpackConfig = createWebpackConfig();

    if (typeof outputOptions === 'string') {
        return merge({}, webpackConfig.output, {
            filename: outputOptions,
        });
    } else {
        return merge({}, webpackConfig.output, outputOptions);
    }
}

function createConfig(entry, output, minify = false, webpackOptions = {}, options = {}) {
    const webpackConfig = createWebpackConfig(options);
    if (!entry) {
        throw new Error('Entry path argument is required');
    }

    if (!output) {
        throw new Error('Output path argument is required');
    }
    const newWebpackConfig = merge({}, webpackConfig, webpackOptions);

    newWebpackConfig.entry = typeof entry === 'string' ? [entry] : entry;
    newWebpackConfig.output = createOutputConfig(output);
    newWebpackConfig.output.libraryTarget = webpackOptions.output ? webpackOptions.output.libraryTarget : webpackConfig.output.libraryTarget;

    newWebpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.optimize.UglifyJsPlugin({
            warnings: false,
            mangle: minify,
            sourceMap: !minify,
            output: {
                comments: !minify,
                beautify: !minify,
            },
        }),
    ];

    return newWebpackConfig;
}


function configWithHot(config) {
    config.entry.unshift('webpack-hot-middleware/client?reload=true');

    config.plugins = config.plugins.concat(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );

    return config;
}

function createCompiler(config) {
    return webpack(config);
}

function createDevMiddleware(compiler, config) {
    return webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: { colors: true, chunks: false },
    });
}

function createHotMiddleware(compiler) {
    return webpackHotMiddleware(compiler);
}

function createBuildTask(compiler) {
    return function webpackBuild(done) {
        compiler.run((err, stats) => {
            if (err) throw new Error(err);
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
    configWithHot,
    createDevMiddleware,
    createHotMiddleware,
    createCompiler,
    createWatchTask,
};

