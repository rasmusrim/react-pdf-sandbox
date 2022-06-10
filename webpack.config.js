import path from 'path';

import browserslist from 'browserslist';

import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const here = (dir) => (dir ? path.resolve(process.cwd(), dir) : process.cwd());

const dirs = {
    src: './src',
    build: './build',
};

function getBuildTarget() {
    const SUPPORTED_BUILD_TARGETS = ['es', 'chrome', 'edge', 'firefox', 'ios', 'node', 'safari'];

    const sep = ' ';
    const supported = (b) =>
        SUPPORTED_BUILD_TARGETS.some((t) => b.startsWith(t + sep)) ? b.replace(sep, '') : undefined;

    return browserslist().map(supported).filter(Boolean);
}

const target = getBuildTarget();

export default (env, args = {}) => {
    const { mode = 'development' } = args;
    const isProduction = mode === 'production';

    return {
        mode,
        context: here(),
        target: 'web',
        entry: {
            app: `${dirs.src}/index`,
        },
        output: {
            path: here(dirs.build),
            filename: isProduction ? 'js/[name]-[chunkhash].js' : 'js/[name].js',
            chunkFilename: isProduction ? 'js/[name]-[chunkhash].js' : 'js/[name].js',
            sourceMapFilename: '[file].map',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            modules: [here('./node_modules'), here(dirs.src)],
        },
        devtool: isProduction ? 'source-map' : 'inline-cheap-module-source-map',
        module: {
            rules: [
                {
                    test: /\.[tj]sx?$/,
                    exclude: here('node_modules'),
                    sideEffects: true,
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'tsx',
                        target,
                    },
                },
                {
                    test: /\.(svg|png)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: `${dirs.src}/static/index.html`,
                cache: true,
                minify: isProduction && {
                    minifyCSS: true,
                    minifyJS: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                chunksSortMode: 'none',
            }),
            new CopyPlugin({
                patterns: [{ from: 'src/manifest.json', to: 'manifest.json' }, { from: `${dirs.src}/assets` }],
            }),
        ],
        optimization: {
            minimize: isProduction,
            moduleIds: 'deterministic',
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxSize: 100000,
                minSize: 20000,
            },
            minimizer: [new ESBuildMinifyPlugin({ target })],
        },
        performance: {
            hints: isProduction && 'warning',
            maxEntrypointSize: Infinity,
            maxAssetSize: 0.25 * 10 ** 6,
        },
        stats: {
            cachedAssets: false,
            children: false,
            modules: false,
            entrypoints: false,
            errorDetails: true,
            excludeAssets: /\.(jpe?g|png|webp|gif|ogg|m4a|mp4|webm|svg|ico|cur|eot|ttf|woff|woff2|map|LICENSE)$/i,
        },
        devServer: {
            historyApiFallback: true,
            hot: 'only',
            port: 3000,
            compress: true,
            client: {
                overlay: true,
            },
            static: {
                watch: true,
                directory: path.join(process.cwd(), dirs.src),
            },
        },
    };
};
