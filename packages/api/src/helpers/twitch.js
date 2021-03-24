import got, {HTTPError} from 'got';

class InvalidAuthCodeError extends HTTPError {
}

class TwitchAPIError extends HTTPError {
}

class UnauthorizedError extends TwitchAPIError {
}

async function exchangeCodeForToken(code) {
	try {
		let result = await got({
			url: "https://id.twitch.tv/oauth2/token",
			method: "POST",
			searchParams: {
				client_id: process.env.TWITCH_CLIENT_ID,
				client_secret: process.env.TWITCH_CLIENT_SECRET,
				redirect_uri: process.env.TWITCH_AUTH_CALLBACK_URL,
				code: code,
				grant_type: "authorization_code"
			}
		}).json();
		//console.log({result});
		return result;
	} catch (e) {
		console.error("Error exchanging code for token:")
		console.error(e);
		const response = JSON.parse(e.response.body);
		if (response.status === 400) {
			throw new InvalidAuthCodeError(e);
		}
		return response;
	}
}

async function exchangeRefreshTokenForToken(refresh_token) {
	try {
		let result = await got({
			url: "https://id.twitch.tv/oauth2/token",
			method: "POST",
			searchParams: {
				client_id: process.env.TWITCH_CLIENT_ID,
				client_secret: process.env.TWITCH_CLIENT_SECRET,
				refresh_token: refresh_token,
				grant_type: "refresh_token"
			}
		}).json();
		//console.log({result});
		return result;
	} catch (e) {
		console.error("Error exchanging refresh token for token:")
		console.error(e);
		const response = JSON.parse(e.response.body);
		if (response.status === 400) {
			throw new InvalidAuthCodeError(e);
		}
		return response;
	}
}

async function getUserInfoFromToken(token) {
	let result = await callHelixAPI("/users", token);
	if (result.data.length === 1) {
		return result.data[0];
	} else {
		return {};
	}

}

async function callHelixAPI(endpoint, token, method = "GET", params = {}, data = null) {
	try {
		let gotObj = {
			url: "https://api.twitch.tv/helix" + endpoint,
			searchParams: params,
			method: method,
			headers: {
				"Client-ID": process.env.TWITCH_CLIENT_ID,
				"Authorization": "Bearer " + token
			}
		};
		if (data !== null) {
			gotObj.json = data;
		}
		return await got(gotObj).json();

	} catch (e) {
		const response = JSON.parse(e.response.body);
		const responseCode = e.response.statusCode;
		if (response.status === 400 || responseCode === 400) {
			throw new TwitchAPIError(e);
		} else if (response.status === 401 || responseCode === 401) {
			if (response.message) {
				console.error("Unauthorized with Twitch API because: " + response.message);
			}
			throw new UnauthorizedError(e);
		}
		console.log("Error calling Twitch API:");
		console.log({response});
		return response;
	}
}

async function callOAuthAPI(endpoint, token, method = "GET", params = {}, data = null) {
	try {
		let gotObj = {
			url: "https://id.twitch.tv/oauth2" + endpoint,
			searchParams: params,
			method: method,
			headers: {
				"Authorization": "OAuth " + token
			}
		};
		if (data !== null) {
			gotObj.json = data;
		}
		return await got(gotObj).json();

	} catch (e) {
		const response = JSON.parse(e.response.body);
		const responseCode = e.response.statusCode;
		if (response.status === 400 || responseCode === 400) {
			throw new TwitchAPIError(e);
		}
		return response;
	}
}

async function getTokenDetails(token) {
	return await callOAuthAPI("/validate", token);
}

export {
	exchangeCodeForToken,
	getUserInfoFromToken,
	getTokenDetails,
	exchangeRefreshTokenForToken,
	InvalidAuthCodeError,
	TwitchAPIError,
	UnauthorizedError
};
