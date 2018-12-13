const path = require('path');
const SentryPlugin = require('webpack-sentry-plugin');

const isProduction = String(process.env.NODE_ENV) === 'production';

module.exports = {
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/dist/',
		filename: 'bundle.js',
		chunkFilename: '[name].[contenthash].bundle.js',
	},
	plugins: [
		new SentryPlugin({
			// Sentry options are required
			organization: 'test-5l',
			project: 'react',
			apiKey: process.env.SENTRY_TOKEN,

			// Release version name/hash is required
			release: 'v2.0.2',
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							insertAt: 'top',
						},
					},
					{ loader: 'css-loader' },
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
							modifyVars: {
								'@font-family':
									"'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
							},
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: {
					loader: 'file-loader',
				},
			},
		],
	},
};
