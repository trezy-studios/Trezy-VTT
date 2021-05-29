module.exports = {
	async redirects() {
		return [
			{
				source: '/settings',
				destination: '/settings/general',
				permanent: true,
			},
		]
	},
}
