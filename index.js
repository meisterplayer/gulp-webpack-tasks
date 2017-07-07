const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const merge = require('lodash.merge');
const createWebpackConfig = require('./lib/create-webpack-config');

// function createConfig(entry, output, minify = false, webpackOptions = {}) {
//     if (!entry) {
//         throw new Error('Entry path argument is required');
//     }

//     if (!output) {
//         throw new Error('Output path argument is required');
//     }

//     const newWebpackConfig = merge({}, webpackConfig, webpackOptions);

//     newWebpackConfig.entry = typeof entry === 'string' ? [entry] : entry;
//     newWebpackConfig.output = createOutputConfig(output);
//     newWebpackConfig.output.libraryTarget = webpackOptions.output ? webpackOptions.output.libraryTarget : webpackConfig.output.libraryTarget;

//     return newWebpackConfig;
// }

function createConfig(entry, output, options = {}) {
    if (typeof entry !== 'string') throw new Error('`entry` argument is required');
    if (typeof output !== 'string') throw new Error('`Output` argument is required');
    if (typeof options === 'boolean') {
        console.warn([
            '---',
            'DEPRECATION: minify became an object instead of a boolean',
            '',
            '   from',
            '       createConfig("./entry.js", "./dist/out.js", true);',
            '   to',
            '       createConfig("./entry.js", "./dist/out.js", { minify: true });',
            '---',
        ].join('\n'));
        options = { minify: options };
    }

    const assertRelative = str => /^\..*/.test(str);

    if (!assertRelative(entry)) throw new Error('entry should be relative');
    if (!assertRelative(output)) throw new Error('output should be relative');

    return createWebpackConfig(entry, output, options);
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

const webpackCallback = callback => {
    let cb = callback;

    return (err, stats) => {
        if (err) throw new Error(err.message || err);

        console.log(stats.toString({
            chunks: false,
            colors: true,
        }));

        if (typeof cb === 'function') {
            cb();
            cb = 'done';
        }
    }
}

function createBuildTask(compiler) {
    return function webpackBuild(callback) {
        compiler.run(webpackCallback(callback));
    }
}

function createWatchTask(compiler, callback) {
    compiler.watch({}, webpackCallback(callback));
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

