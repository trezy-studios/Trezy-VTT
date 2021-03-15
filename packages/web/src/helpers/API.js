// Local imports
import * as Cookies from 'helpers/Cookies'





async function apiFetch(options) {
	const {
		body,
		route,
	} = options
	const fetchOptions = {
		...options,
		headers: {
			...(options.headers || {}),
		},
	}

	if (body) {
		fetchOptions.headers['Content-Type'] = 'application/json'
		fetchOptions.body = JSON.stringify(body)
	}

	try {
		let response = await fetch(`/api${route}`, fetchOptions)
		return response
	} catch (error) {
		return error
	}
}

const API = {
	delete(options) {
		return apiFetch({
			...options,
			method: 'delete',
		})
	},

	get(options) {
		return apiFetch({
			...options,
			method: 'get',
		})
	},

	patch(options) {
		return apiFetch({
			...options,
			method: 'patch',
		})
	},

	post(options) {
		return apiFetch({
			...options,
			method: 'post',
		})
	},

	put(options) {
		return apiFetch({
			...options,
			method: 'put',
		})
	},
}



export default API
