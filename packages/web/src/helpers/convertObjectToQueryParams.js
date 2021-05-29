export function convertObjectToQueryParams(source) {
	return Object.entries(source).reduce((accumulator, [key, value], index) => {
		if (index !== 0) {
			accumulator += '&'
		}

		return accumulator + `${key}=${value}`
	}, '?')
}
