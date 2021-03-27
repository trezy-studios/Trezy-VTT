// Local imports
import {
	firebase,
	firestore,
} from 'helpers/firebase';
import * as twitch from 'helpers/twitch'
import {UnauthorizedError} from 'helpers/twitch';
import {HTTPError} from "got";

let http = require('http');

let currentlyModifying = {};
let listeningRewards = {};

// Wrap it all in an `async` IIFE so we can simulate top-level `await`.
(async () => {
	// Create a collection reference
	const campaignsCollection = firestore.collection('campaigns');
	const rewardsCollection = firestore.collection('rewards');
	rewardsCollection.onSnapshot(async (snapshot) => {
		for (const change of snapshot.docChanges()) {
			let data = change.doc.data();
			if (data.campaignID) {
				let campaignRef = campaignsCollection.doc(data.campaignID);
				let campaignData = (await campaignRef.get()).data();
				if (campaignData.isActive) {
					try {
						await handleRewardsChanges(change, campaignData);
					} catch (e) {
						if (e instanceof NoTwitchInforForRewardsError) {
							console.error("Tried to process rewards without Twitch Info. Ignoring.");
						} else {
							console.error(e);
							if (e.response) {
								console.error(e.response.body);
							}
							throw e;
						}
					}
				} else {
					console.log("Ignoring change of a Reward for an inactive Campaign.")
				}
			} else {
				console.error("Change for a Reward that didn't have an associated campaign. Ignoring.");
			}
		}
	});


	const testingCode = "REDACTED";
	const testingUserID = "REDACTED";
	const testingUserFirebaseID = "wUCzHxpZxORUYDpby3zSF6mUm1u2";
	//await refreshUser(testingUSerFirebaseID);
	try {
		/*await createOrUpdateUserFromAuthCode(null,
			{
				access_token: "REDACTED",
				refresh_token: "REDACTED",
				scope: ["channel:manage:redemptions"],
				expires_in: 13178
			});*/
		//await createOrUpdateUserFromOAuthToken("REDACTED");
		//await createOrUpdateUserFromAuthCode(testingCode, testingUserFirebaseID);
	} catch (e) {
		if (e instanceof UnauthorizedError) {
			console.error("Was unauthorized...");
			try {
				await refreshUser(testingUserID);
			} catch (e) {
				console.error("Couldn't refresh...");
				console.error(e);
			}
		} else {
			console.error("Error during testing, top level caught: " + e.constructor.name);
			console.error(e);
		}

	}

	// Create an object representing the new campaign locally
	/*const newCampaign = {
		createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		description: 'It\'s a Campaign!',
		game: 'dnd5e',
		isActive: true,
		name: 'Example Campaign',
		ownerID: 'bob',
		updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
	}

	// We'll use the `add` method on our campaigns collection to add the campaign
	// to Firestore and have it assign a random ID to it. We'll also `await` the
	// add, which will return a promise that resolves to a reference to the new
	// document.
	const newCampaignRef = await campaignsCollection.add(newCampaign)

	// Get the rewards subcollection
	const rewardsCollection = newCampaignRef.collection('rewards')

	// Add a reward
	const id = "HI THERE";
	const newRewardRef = await rewardsCollection.doc(id).set({
		color: '#008000',
		cooldown: 1800,
		cost: 1000,
		isMaxRedemptionsPerUser: true,
		maxRedemptions: 5,
		title: 'Grant a healing potion!',
	})

	// The ID that was assigned to the doc in the database.
	console.log(newCampaignRef.id)

	// Get a reward
	const newRewardDoc = await rewardsCollection.doc(id).get();

	console.log({
		...newRewardDoc.data(),
		id: newRewardDoc.id,
	})

	// Get all rewards
	const newRewardCollectionDocs = await rewardsCollection.get()

	newRewardCollectionDocs.forEach(doc => {
		console.log({
			...doc.data(),
			id: doc.id,
		})
	});

	console.log('Hello World')*/


	await twitch.connectToPubSub()
})();

class NoTwitchInforForRewardsError extends Error {
}

async function handleRewardsChanges(change, campaign_data) {
	console.log("An active campaign's rewards collection has been changed!");

	let profile = await firestore.collection("profiles").doc(campaign_data.ownerID).get();
	let twitch_info = (await profile.data()).twitch_info;
	if (!twitch_info) {
		throw new NoTwitchInforForRewardsError("Tried to process a rewards change without any Twitch Info available for the Owner of a campaign. Please make sure the Owner has valid twitch_info.")
	}

	async function createRewardOnTwitch(changed_doc_data, firebase_id) {
		// reward didn't exist, re-create it and update the local ID!
		let result = await twitch.createReward(twitch_info.id, twitch_info.access_token, {
			title: changed_doc_data.title,
			prompt: "Redeem " + changed_doc_data.title + " for the Campaign " + campaign_data.name,
			cost: changed_doc_data.cost,
			is_enabled: false,
			background_color: changed_doc_data.color,
			is_global_cooldown_enabled: Boolean(parseInt(changed_doc_data.cooldown)),
			global_cooldown_seconds: parseInt(changed_doc_data.cooldown) || 0,
			is_max_per_stream_enabled: Boolean(parseInt(changed_doc_data.maxRedemptions)) && (!changed_doc_data.isMaxRedemptionsPerUser),
			is_max_per_user_per_stream_enabled: Boolean(parseInt(changed_doc_data.maxRedemptions)) && changed_doc_data.isMaxRedemptionsPerUser,
			max_per_user_per_stream: parseInt(changed_doc_data.maxRedemptions) || 0,
			max_per_stream: parseInt(changed_doc_data.maxRedemptions) || 0,
			should_redemptions_skip_request_queue: true
		});
		//console.log(JSON.stringify(result));
		currentlyModifying[firebase_id] = true;
		firestore.collection("rewards").doc(firebase_id).set({
			twitch_id: result.data[0].id,
			lastSync: firebase.firestore.FieldValue.serverTimestamp()
		}, {merge: true});
	}


	const current_id = change.doc.id;
	if (current_id in currentlyModifying) {
		delete currentlyModifying[current_id];
		return;
	}
	let changed_doc_data = change.doc.data();
	console.log({changed_doc_data});
	console.log(change.type);
	switch (change.type) {
		case "added":
		case "modified":
			console.log("added/modified");
			if (!changed_doc_data.twitch_id) {
				// Must just add and save new data.
				try {
					await createRewardOnTwitch(changed_doc_data, current_id);
				} catch (e) {
					if (e instanceof twitch.UnauthorizedError) {
						try {
							await refreshUser(campaign_data.ownerID);
							twitch_info = (await profile.data()).twitch_info;
						} catch (e) {
							if (e instanceof twitch.TwitchAPIError) {
								console.error("Error trying to refresh User after invalid authwas present (during Checking of existing Reward):");
								console.error(e);
								return;
							} else {
								throw e;
							}
						}
						await createRewardOnTwitch(changed_doc_data, current_id);
					} else {
						console.error("Unknown Error creating reward in Twitch API:");
						console.error(e);
						throw e;
					}
				}

			} else {
				// check existing reward and see if we need to update it
				let result;
				try {
					try {
						result = await twitch.getSingleRewardByIDAsArray(twitch_info.id, changed_doc_data.twitch_id, twitch_info.access_token);
					} catch (e) {
						if (e instanceof twitch.UnauthorizedError) {
							try {
								await refreshUser(campaign_data.ownerID);
								twitch_info = (await profile.data()).twitch_info;
							} catch (e) {
								if (e instanceof twitch.TwitchAPIError) {
									console.error("Error trying to refresh User after invalid auth was present (during Checking of existing Reward):");
									console.error(e);
								}
								throw e;
							}
							result = await twitch.getSingleRewardByIDAsArray(twitch_info.id, changed_doc_data.twitch_id, twitch_info.access_token);
						} else {
							throw e;
						}
					}
				} catch (e) {
					if (e instanceof HTTPError) {
						if (e.response.statusCode === 404) {
							result = []; // Reward didn't exist in API. Handled below.
						} else {
							console.error("Unknown Error getting existing reward from Twitch API:");
							console.error(e);
							return;
						}
					} else {
						console.error("Unknown Error getting existing reward from Twitch API:");
						console.error(e);
						return;
					}
				}

				if (result.length !== 1) {
					console.log("There was no reward on Twitch for a local Reward that had a Twitch ID. Assuming it got deleted from Twitch, recreating...");
					await createRewardOnTwitch(changed_doc_data, current_id);
				} else {
					let existing_reward = result[0];
					// TODO: Compare reward data with local copy. Update if necessary.
					console.log("Need to check if this stuff differs from local copy: " + JSON.stringify(existing_reward));
				}
			}
			async function addCallbackToTwitch() {
				let callback = async (data) => {
					let current_firebase_reward = await (await firestore.collection("rewards").doc(current_id).get()).data();
					if (current_firebase_reward.twitch_id === data.redemption.reward.id) {
						console.log("TRIGGER EVENTS FOR " + current_id + " NOW!");
						firestore.collection("redemptions").add({rewardID: current_id, twitchData: data});
					}
				}
				await twitch.addChannelToListenToForRewards(twitch_info.id, twitch_info.access_token, callback);
				listeningRewards[current_id] = callback;
			}

			if (!(current_id in listeningRewards)) {
				await addCallbackToTwitch();
			} else {
				await twitch.removeCallback(twitch_info.id, listeningRewards[current_id]);
				await addCallbackToTwitch();
			}
			break;
		case "removed":
			if (!changed_doc_data.twitch_id) {
				console.log("A non-twitch-synced reward was deleted. Ignoring, but this shouldn't really ever happen unless in an erroneus state.");
				return;
			}
			try {
				await twitch.deleteReward(twitch_info.id, changed_doc_data.twitch_id, twitch_info.access_token);
			} catch (e) {
				if (e instanceof twitch.UnauthorizedError) {
					try {
						await refreshUser(campaign_data.ownerID);
						twitch_info = (await profile.data()).twitch_info;
					} catch (e) {
						if (e instanceof twitch.TwitchAPIError) {
							console.error("Error trying to refresh User after invalid auth was present (during deletion of a deleted Reward):");
							console.error(e);
							return;
						}
					}
					await twitch.deleteReward(twitch_info.id, changed_doc_data.twitch_id, twitch_info.access_token);
				} else {
					if (e.response) {
						if (e.response.statusCode === 404) {
							console.error("A reward that was deleted from firebase was not found on the Twitch API as it was trying to be deleted. This should be safe to ignore.");
						} else {
							console.error("Error deleting reward from Twitch API:");
							console.error(e.response.body);
						}
					} else {
						console.error("Unknown Error deleting reward from Twitch API:");
						console.error(e);
						throw e;
					}
				}
			}
			await twitch.removeCallback(twitch_info.id, listeningRewards[current_id]);
			console.log("removed from Twitch.");
			break;
		default:
			console.log("UNKNOWN CHANGE TYPE");
	}

}

async function createOrUpdateUserFromTokenDetailed(access_token, expires_in, scope, firebase_user_id, refresh_token = null, remove_refresh_token = false) {
	const userInfo = await twitch.getUserInfoFromToken(access_token);
	userInfo.access_token = access_token;
	if (refresh_token !== null || remove_refresh_token) {
		userInfo.refresh_token = refresh_token;
	}
	userInfo.scopes = scope;
	userInfo.created_at = firebase.firestore.Timestamp.fromMillis(Date.parse(userInfo.created_at));
	userInfo.expires_at = firebase.firestore.Timestamp.fromMillis(Date.now() + (expires_in * 1000));
	console.log("Refreshed user " + firebase_user_id);
	return firestore.collection("profiles").doc(firebase_user_id).set({twitch_info: userInfo}, {merge: true});
	//console.log("Result: " + JSON.stringify(result));
}

async function createOrUpdateUserFromAuthCode(code, firebase_user_id, overrideObj = null) { // override is used for testing. Expect it to not exist in prod.
	let {
		access_token,
		refresh_token,
		scope,
		expires_in
	} = overrideObj === null ? await twitch.exchangeCodeForToken(code) : overrideObj;
	await createOrUpdateUserFromTokenDetailed(access_token, expires_in, scope, firebase_user_id, refresh_token);
}

async function createOrUpdateUserFromOAuthToken(token, firebase_user_id) {
	let {scopes, expires_in} = await twitch.getTokenDetails(token);
	await createOrUpdateUserFromTokenDetailed(token, expires_in, scopes, firebase_user_id);
}

class NoTokenAvailableError extends Error {
}

async function refreshUser(firebase_user_id) {
	let profile = await firestore.collection("profiles").doc(firebase_user_id).get();
	let twitch_info = (await profile.data()).twitch_info;
	//console.log({twitch_info});
	if (!twitch_info) {
		throw new NoTokenAvailableError("No Twitch Info available for selected User ID. Please let them set it first!");
	}
	if (!twitch_info.refresh_token) {
		throw new NoTokenAvailableError("No refresh token available for selected User ID. Please set it first.");
	}
	let response = await twitch.exchangeRefreshTokenForToken(twitch_info.refresh_token);
	return createOrUpdateUserFromTokenDetailed(response.access_token, response.expires_in, response.scope, firebase_user_id);
}



export {
	createOrUpdateUserFromAuthCode,
	createOrUpdateUserFromOAuthToken,
	NoTokenAvailableError,
	NoTwitchInforForRewardsError
};


async function requestListener(req, res) {
	let request_url_details = new URL(req.url, `http://${req.headers.host}`);
	let queryParams = request_url_details.searchParams;
	let code = queryParams.get('code');
	let firebase_id = queryParams.get('firebase_id');
	if (!(code && firebase_id)) {
		res.writeHead(400, "Missing Parameters");
		res.end(JSON.stringify({"error": "Missing 'code' or 'firebase_id' query parameters.", "status":"error"}));
		return
	} else {
		try {
			await createOrUpdateUserFromAuthCode(code, firebase_id);
		} catch (e) {
			console.error(e);
			try {
				console.error(e.response.body);
			} catch {}
			res.writeHead(500, "Internal Server Error");
			res.end(JSON.stringify({"error": "Error during processing. Refer to the console log, please.", "status":"error"}))
			return;
		}
	}
	res.writeHead(200, "OK");
	res.end(JSON.stringify({"error":null, "status": "done"}));
}

let server = http.createServer(requestListener);
server.listen(process.env.TWITCH_LOCAL_PORT);
