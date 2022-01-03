const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { webpack, DefinePlugin } = require('webpack');

module.exports = {
	mode: 'production',
	node: false,
	entry: {
		main: './src/popup/main.js',
		background: '/src/background/background.js',
		'content-script': '/src/content-script/content-script.js',
		'options': '/src/options/options.js',
	},
	output: {
		publicPath: '',
		path: path.resolve(__dirname, 'addon'),
		filename: 'js/[name].js'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{loader: 'css-loader', options: {importLoaders: 1}},
					{loader: 'sass-loader'},
				],
			},
			{
				test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
			}
		]
		,
	},
	plugins: [
		new HtmlWebpackPlugin({
			chunks: ['main'],
			templateContent: `
		<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <div id="app-root"></div>
      </body>
    </html>
            `
		}),
		new HtmlWebpackPlugin({
			chunks: ['options'],
			templateContent: `
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <div id="app-root"></div>
      </body>
    </html>
            `,
			filename: 'options.html',
		}),
		new CopyPlugin({
			patterns: [
				{from: 'src/manifest.json', to: 'manifest.json'},
				{from: 'src/resources', to: 'resources'},
			],
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
		}),
		new VueLoaderPlugin(),
		new DefinePlugin({
			OWNCAST_BROWSER_EXTENSION_VERSION: JSON.stringify(process.env.npm_package_version),
		})
	]
};
