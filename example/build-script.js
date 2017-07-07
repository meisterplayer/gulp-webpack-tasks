const { createConfig, createCompiler, createBuildTask } = require('../index');

const webpackConfig = createConfig('./example/main.js', './dist/hello.js', {
    minify: false,
    cssInjection: false,
});

const compiler = createBuildTask(createCompiler(webpackConfig));

compiler();
