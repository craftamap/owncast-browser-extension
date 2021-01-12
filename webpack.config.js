const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		main: './src/main.js',
		background: '/src/background.js',
	},
	output: {
		path: path.resolve(__dirname, 'addon'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.s(a|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{loader: 'css-loader', options: {importLoaders: 1}},
					{loader: 'sass-loader'},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									'tailwindcss'
								],
							}
						}
					},
				],
			},
			{test: /\.hbs$/, loader: 'handlebars-loader'}
		]
		,
	},
	plugins: [
		new HtmlWebpackPlugin({
			chunks: ['main'],
			templateContent: `
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
		new CopyPlugin({
			patterns: [
				{from: 'src/manifest.json', to: 'manifest.json'},
			],
		}),
		new MiniCssExtractPlugin()
	]
};
