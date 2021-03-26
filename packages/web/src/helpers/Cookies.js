const COOKIE_OPTION_BOOLEANS = ['samesite', 'secure']
const COOKIE_OPTION_STRINGS = ['domain', 'expires', 'max-age', 'path']
const RESERVED_COOKIE_NAMES = [
	...COOKIE_OPTION_BOOLEANS,
	...COOKIE_OPTION_STRINGS,
]
const REGEX_STRING = `.*?=(.*?)(?:;)((?:(?:(?:${COOKIE_OPTION_BOOLEANS.join('|')})|(?:(?:${COOKIE_OPTION_STRINGS.join('|')})=.*?))(?:;|$))*)`

let cookieString = null
let cookieJar = null

function remove(name) {
	const cookie = get(name)
	set(name, ';max-age=0;')
}

// If a `name` is passed, returns the value of that cookie. Otherwise, return
// the entire cookie jar.
function get(name) {
	if (document.cookie !== cookieString) {
		updateCachedCookie()
	}

	if (name) {
		return cookieJar[name]
	}

	return cookieJar
}

function set(name, value, options = {}) {
	if (RESERVED_COOKIE_NAMES.includes(name)) {
		console.error(`COOKIE HAS NOT BEEN SET: ${name}. ${name} is reserved.`)
	}

	let cookieStringToSet = `${name}=${value}`

	Object.keys(options).forEach(key => {
		if (![...COOKIE_OPTION_STRINGS, 'maxAge'].includes(key)) {
			console.warn(`Unrecognized option set for cookie ${name}: ${key}`)
		}
	})

	if (options.maxAge) {
		cookieStringToSet += `;max-age=${options.maxAge}`
	}

	COOKIE_OPTION_STRINGS.forEach(key => {
		if (options[key]) {
			cookieStringToSet += `;${key}=${options[key]}`
		}
	})

	document.cookie = cookieStringToSet
}

function updateCachedCookie() {
	cookieString = document.cookie

	// Trim spaces around semicolons and equals
	cookieString = cookieString
		.replace(/\s*;\s*/g, ';')
		.replace(/\s*\=\s*/g, '=')

	const cookies = [...document.cookie.matchAll(new RegExp(REGEX_STRING, 'g'))]

	cookieJar = cookies.reduce((accumulator, cookieArray) => {
		const [,
			name,
			value,
			optionsString = '',
		] = cookieArray

		const options = optionsString
			.replace(/;$/, '')
			.split(';')
			.reduce((optionsAccumulator, optionString) => {
				const [key, value] = optionString.split('=')

				optionsAccumulator[key] = value ?? true

				return optionsAccumulator
			}, {})

		accumulator[name] = {
			options,
			value,
		}

		return accumulator
	}, {})
}

export {
	get,
	remove,
	set,
}
