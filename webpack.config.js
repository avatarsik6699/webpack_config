const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

// helper functions----------------------------------------------------------
const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;
const jsLoader = () => {
    const loaders = [{
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-class-properties'],
      },
    }];

    return loaders;
};

// loaders-----------------------------------------------------------
const sass = {
    test: /\.s[ac]ss$/i,
    include: path.resolve(__dirname, 'src/'),
    use: [
        isDev 
        ? 'style-loader' 
        :{ 
            loader: MiniCssExtractPlugin.loader, 
            options: {
                hmr: isDev,
                reloadAll: true,
            },
        },
        { loader: 'css-loader', options: {sourceMap: true} },
        { loader: 'resolve-url-loader' },
        { loader: 'sass-loader', options: {sourceMap: true} },
        ],
};

const pug = {
    test: /\.pug$/,
    include: path.resolve(__dirname, 'src/'),
    use: ["pug-loader"]
};

// module description----------------------------------------
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: isDev ? 'source-map' : false,
    resolve: {
      extensions: ['.js', '.css'],
    },
    devServer: {
        contentBase: './dist',
        hot: isDev,
        port: 3000
    },

    module: {
        rules: [
            sass,
            pug,
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoader(),
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // filename: '[hash].html',
            template: 'index.pug',
            removeComments: isProd,
            collapseWhiteSpace: isProd,
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? "styles/[name].[contenthash].css" : "[name].css",
        }),
    ],
};