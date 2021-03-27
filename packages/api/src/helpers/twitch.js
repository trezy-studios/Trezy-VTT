import got, {HTTPError} from 'got';
import WebSocket from 'ws';
let pub_sub_channels_to_listen_to = [];

let pubSub;
let connecting = true;

class InvalidAuthCodeError extends HTTPError {
}

class TwitchAPIError extends HTTPError {
}

class UnauthorizedError extends TwitchAPIError {
}

async function pubSubPing() {
	try {
		pubSub.send(JSON.stringify({type: "PING"}));
	} catch {}
	setTimeout(pubSubPing, (260 + Math.floor((Math.random() * 40))) * 1000);
}

async function onPubSubConnect() {
	connecting = false;
	console.log("Connected to PubSub");
	await pubSubPing();
	for (const channel of pub_sub_channels_to_listen_to) {
		listenTo(channel.id, channel.token);
	}
}

async function onPubSubMessage(event) {
	let data = JSON.parse(event.data);
	switch (data.type) {
		case "MESSAGE": {
			let message = JSON.parse(data.data.message);
			console.log("MESSAGE OF TOPIC " + data.data.topic + ": " + JSON.stringify(message));
			if (!data.data.topic.startsWith("channel-points-channel")) {
				console.log("Unknown Topic " + data.data.topic);
				return;
			}
			if (message.type !== "reward-redeemed") {
				console.log("Unknown type " + message.type);
				return
			}
			let inner_data = message.data;
			let redemption = inner_data.redemption;
			let reward = redemption.reward;
			let listener = pub_sub_channels_to_listen_to.find((element) => element.id === redemption.channel_id);
			if (listener) {
				for (const callback of listener.callbacks) {
					await callback(inner_data);
				}
			}
			break;
		}
		case "PONG": {
			console.log("PUBSUB PONG");
			break;
		}
		default: {
			console.log("PUBSUB UNKNOWN MESSAGE EVENT " + data.type);
			console.log(event.data);
		}
	}
}

async function connectToPubSub() {
	if (pub_sub_channels_to_listen_to.length < 1) {
		console.error("Don't have any channels to listen to, not connecting to pubsub.");
		return;
	}
	if (connecting) {
		console.log("already connecting, not connecting again...");
	}
	connecting = true;
	if (pubSub) {
		try {
			pubSub.disconnect();
		} catch {}
	}
	pubSub = new WebSocket('wss://pubsub-edge.twitch.tv');
	pubSub.onopen = onPubSubConnect;
	pubSub.onmessage = onPubSubMessage;
}

function listenTo(twitch_id, token) {
	if (connecting) {
		console.log("Still connecting, not adding listener on pubsub...");
	}
	pubSub.send(JSON.stringify({
		type: "LISTEN",
		data: {
			topics: ["channel-points-channel-v1." + twitch_id],
			auth_token: token
		}
	}));
}

function unlistenTo(twitch_id) {
	if (connecting) {
		console.log("Still connecting, not removing listener on pubsub...");
	}
	pubSub.send(JSON.stringify({
		type: "UNLISTEN",
		data: {
			topics: ["channel-points-channel-v1." + twitch_id]
		}
	}));
}

async function addChannelToListenToForRewards(twitch_id, token, callback) {
	let shouldConnect = pub_sub_channels_to_listen_to.length === 0;
	const isListening = isListeningTo(twitch_id);
	if (isListening) {
		pub_sub_channels_to_listen_to.find(element => element.id === twitch_id).callbacks.push(callback);
	} else {
		pub_sub_channels_to_listen_to.push({id: twitch_id, token, callbacks: [callback]});
	}
	if (shouldConnect) {
		await connectToPubSub();
	} else if (!isListening) {
		listenTo(twitch_id, token);
	}
}

async function removeCallback(twitch_id, callback) {
	const element = pub_sub_channels_to_listen_to.find(element => element.id === twitch_id);
	if (element) {
		let index = element.callbacks.indexOf(callback);
		if (index > -1) {
			element.callbacks.splice(index, 1);
		}
		if (element.callbacks.length === 0) {
			unlistenTo(twitch_id);
			index = pub_sub_channels_to_listen_to.indexOf(element);
			if (index > -1) {
				pub_sub_channels_to_listen_to.splice(index, 1);
			}
		}
	}
}

function isListeningTo(twitch_id) {
	return pub_sub_channels_to_listen_to.find(element => element.id === twitch_id);
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
		throw e;
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

async function getAllRewards(broadcaster_id, token) {
	return (await callHelixAPI('/channel_points/custom_rewards', token, "GET", {broadcaster_id, only_manageable_rewards: true})).data;
}

async function getSingleRewardByIDAsArray(broadcaster_id, reward_id, token) {
	return (await callHelixAPI('/channel_points/custom_rewards', token, "GET", {broadcaster_id, only_manageable_rewards: true, id: reward_id})).data;
}

async function createReward(broadcaster_id, token, reward) {
	return callHelixAPI('/channel_points/custom_rewards', token, "POST", {broadcaster_id}, reward);
}

async function deleteReward(broadcaster_id, reward_id, token) {
	return callHelixAPI("/channel_points/custom_rewards", token, "DELETE", {broadcaster_id, id: reward_id});
}

export {
	exchangeCodeForToken,
	getUserInfoFromToken,
	getTokenDetails,
	exchangeRefreshTokenForToken,
	getAllRewards,
	getSingleRewardByIDAsArray,
	createReward,
	deleteReward,
	connectToPubSub,
	addChannelToListenToForRewards,
	removeCallback,
	InvalidAuthCodeError,
	TwitchAPIError,
	UnauthorizedError
};
