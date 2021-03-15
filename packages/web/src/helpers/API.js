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
	}

	const firebaseAuthToken = Cookies.get('firebaseAuthToken')

	if (firebaseAuthToken) {
		fetchOptions.headers.Authorization = `Bearer ${firebaseAuthToken}`
	}

	try {
		await fetch(`/api${route}`, fetchOptions)
	} catch (error) {
		return error
	}
}

export async function delete(options) {
	apiFetch({
		...options,
		method: 'delete',
	})
}

export async function get(options) {
	apiFetch({
		...options,
		method: 'get',
	})
}

export async function patch(options) {
	apiFetch({
		...options,
		method: 'patch',
	})
}

export async function post(options) {
	apiFetch({
		...options,
		method: 'post',
	})
}

export async function put(options) {
	apiFetch({
		...options,
		method: 'put',
	})
}
