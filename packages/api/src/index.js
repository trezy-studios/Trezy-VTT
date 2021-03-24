// Local imports
import {
	firebase,
	firestore,
} from 'helpers/firebase';
import * as twitch from 'helpers/twitch'
import {UnauthorizedError} from 'helpers/twitch';

let first = true;
let listeningCampaigns = {};

// Wrap it all in an `async` IIFE so we can simulate top-level `await`.
(async () => {
	// Create a collection reference
	const campaignsCollection = firestore.collection('campaigns');
	campaignsCollection.onSnapshot((snapshot) => {
		/*if (first) {
			console.log("First snapshot, assuming initial state...");
			first = false;
			return;
		}*/
		const changes = snapshot.docChanges();
		for (const change of changes) {
			switch (change.type) {
				case "added":
				case "modified":
				{
					let data = change.doc.data();
					//console.log(change.type + ": " + JSON.stringify(data));
					if (data.isActive) {
						if (!(change.doc.id in listeningCampaigns)) {
							listeningCampaigns[change.doc.id] = change.doc.ref.collection("rewards").onSnapshot(async (snapshot) => {
								try {
									await handleRewardsChanges(snapshot, change.doc.ref);
								} catch (e) {
									if (e instanceof NoTwitchInforForRewardsError) {
										console.error("Tried to process rewards without Twitch Info. Ignoring.");
									} else {
										throw e;
									}
								}

								//console.log(JSON.stringify(snapshot.docChanges()));
							});
							console.log("Added listener for " + change.doc.id)
						}
					} else {
						if (change.doc.id in listeningCampaigns) {
							listeningCampaigns[change.doc.id]();
							delete listeningCampaigns[change.doc.id];
							console.log("made inactive/removed: " + change.doc.id);
						}
					}
					break;
				}
				case "removed":
				{
					if (change.doc.id in listeningCampaigns) {
						listeningCampaigns[change.doc.id]();
						delete listeningCampaigns[change.doc.id];
					}
					console.log("removed: " + change.doc.id);
					break;
				}
				default:
					console.log("Unknown change type: " + change.type);
			}
		}
		first = false;
	});


	const testingCode = "REDACTED";
	const testingUserID = "REDACTED";
	const testingUSerFirebaseID = "wUCzHxpZxORUYDpby3zSF6mUm1u2";
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
		//await createOrUpdateUserFromAuthCode(testingCode, testingUSerFirebaseID);
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
})();

class NoTwitchInforForRewardsError extends Error {
}

async function handleRewardsChanges(snapshot, campaign_doc) {
	console.log("An active campaign's rewards collection has been changed!");
	let campaign = await campaign_doc.get();
	let campaign_data = await campaign.data();
	let profile = await firestore.collection("profiles").doc(campaign_data.ownerID).get();
	let twitch_info = (await profile.data()).twitch_info;
	if (!twitch_info) {
		throw new NoTwitchInforForRewardsError("Tried to process a rewards change without any Twitch Info available for the Owner of a campaign. Please make sure the Owner has valid twitch_info.")
	}
	let existing_twitch_rewards = [];
	let doc_changes = snapshot.docChanges();
	for (const doc_change of doc_changes) {
		let changed_doc_data = doc_change.doc.data();
		// TODO: Check Twitch API and sync rewards
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

export {createOrUpdateUserFromAuthCode, createOrUpdateUserFromOAuthToken, NoTokenAvailableError, NoTwitchInforForRewardsError};
