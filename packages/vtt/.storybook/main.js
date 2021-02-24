// Module imports
const webpackConfig = require('../webpack.config.js')

module.exports = {
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials'
	],

	stories: ['../src/**/*.stories.js'],

	webpackFinal: config => {
    return {
			...config,
			module: {
				...config.module,
				rules: webpackConfig.module.rules,
			},
			plugins: [
				...config.plugins,
				...webpackConfig.plugins,
			],
		}
  },
}
