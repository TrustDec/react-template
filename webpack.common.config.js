const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

commonConfig = {
    entry: {
        app: [
            "babel-polyfill",
            path.join(__dirname, 'src/index.js')
        ],
        vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux']
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'static/js/[name].[chunkhash].js',
        chunkFilename: 'static/js/[name].[chunkhash].js',
        //publicPath: "./react-mc/",
        //./wapp/webpage/schoolbus/_run
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: [
                path.join(__dirname, 'src'),
                path.resolve(__dirname, 'node_modules/amazeui-touch/js'),
            ]
        }, {
            test: /\.(png|jpg|gif)$/,
            loader:"url-loader"
            /* use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'static/images/[name]-[hash:8].[ext]',
                }
            }] */
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'src/index.html')
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        })
    ],

    resolve: {
        alias: {
            pages: path.join(__dirname, 'src/pages'),
            components: path.join(__dirname, 'src/components'),
            router: path.join(__dirname, 'src/router'),
            actions: path.join(__dirname, 'src/redux/actions'),
            reducers: path.join(__dirname, 'src/redux/reducers'),
            mock: path.join(__dirname, 'mock')
        }
    }
};

module.exports = commonConfig;