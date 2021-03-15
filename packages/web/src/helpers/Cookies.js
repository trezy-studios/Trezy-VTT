function cookieReducer(accumulator, cookiePair) {
	const [key, value] = cookiePair.split('=')
	accumulator[key.trim()] = value.trim()
	return accumulator
}

function remove(cookieName) {
	const cookie = get(cookieName)
	set(cookieName, ';max-age=0;')
}

// If a `cookieName` is passed, returns the value of that cookie. Otherwise,
// it returns an object of all cookies.
function get(cookieName) {
	if (cookieName) {
		// Destructuring arrays looks weird sometimes. There's a leading comma here
		// because it's actually destructuring 2 values, but we're only assigning
		// one of them to a variable.

		// Also, if the regex doesn't have any matches, it returns null. That causes
		// the array destructuring to explode, so we return an empty array to
		// prevent that from happening.
		const [, value] = (RegExp(`${cookieName}=(.*?)(;|$)`).exec(document.cookie) || [])
		return value
	}

	return document.cookie.split(';').reduce(cookieReducer, {})
}

function set(cookieName, value) {
	document.cookie = `${cookieName}=${value}`
}

export {
	get,
	remove,
	set,
}
