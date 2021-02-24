require('dotenv').config()

// Module imports
const {
	EnvironmentPlugin,
	ProvidePlugin,
} = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')





module.exports = {
	devtool: 'source-map',

	externals: [nodeExternals()],

	mode: 'development',

	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					{ loader: MiniCSSExtractPlugin.loader },
					{ loader: 'css-loader' },
					{
						loader: 'resolve-url-loader',
						options: {
							root: path.resolve(__dirname, 'src'),
						},
					},
					{ loader: 'sass-loader' },
				],
			},

			{
				test: /\.(eot|otf|ttf|woff2?)$/,
				use: [
					{ loader: 'url-loader?limit=100000' },
				],
			},

			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					{ loader: 'url-loader?limit=100000' },
					{ loader: 'image-webpack-loader' },
				],
			},

			{
				test: /\.js?$/,
				use: {
					loader: 'babel-loader',
					options: {
						exclude: /node_modules/,
					},
				},
			},

			{
				test: /\.worker\.js$/,
				use: { loader: 'worker-loader' },
			},
		],
	},

	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'commonjs',
	},

	plugins: [
		new CleanWebpackPlugin,
		new EnvironmentPlugin([]),
		new ProvidePlugin({ React: 'react' }),
		new OptimizeCSSAssetsPlugin,
		new MiniCSSExtractPlugin({ filename: '[name].css' }),
	],
}
