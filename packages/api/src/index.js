// Local imports
import {
	firebase,
	firestore,
} from 'helpers/firebase';
import * as twitch from 'helpers/twitch'
import {UnauthorizedError} from 'helpers/twitch';

let first = true;

// Wrap it all in an `async` IIFE so we can simulate top-level `await`.
(async () => {
	// Create a collection reference
	const campaignsCollection = firestore.collection('campaigns');
	campaignsCollection.onSnapshot((snapshot) => {
		if (first) {
			console.log("First snapshot, assuming initial state...");
			first = false;
			return;
		}
		const changes = snapshot.docChanges();
		for (const change of changes) {
			console.log(change.doc.data());
		}
	});

	const testingCode = "REDACTED";
	const testingUserID = "REDACTED";
	try {
		/*await createOrUpdateUserFromAuthCode(null,
			{
				access_token: "REDACTED",
				refresh_token: "REDACTED",
				scope: ["channel:manage:redemptions"],
				expires_in: 13178
			});*/
		await createOrUpdateUserFromOAuthToken("REDACTED");
		//await createOrUpdateUserFromAuthCode(testingCode)
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


async function createOrUpdateUserFromTokenDetailed(access_token, expires_in, scope, refresh_token = null, remove_refresh_token = false) {
	const userInfo = await twitch.getUserInfoFromToken(access_token);
	userInfo.access_token = access_token;
	if (refresh_token !== null || remove_refresh_token) {
		userInfo.refresh_token = refresh_token;
	}
	userInfo.scopes = scope;
	userInfo.created_at = firebase.firestore.Timestamp.fromMillis(Date.parse(userInfo.created_at));
	userInfo.expires_at = firebase.firestore.Timestamp.fromMillis(Date.now() + (expires_in * 1000));
	console.log({userInfo});
	await firestore.collection("users").doc(userInfo.id).set(userInfo, {merge: true});
}

async function createOrUpdateUserFromAuthCode(code, overrideObj = null) { // override is used for testing. Expect it to not exist in prod.
	let {
		access_token,
		refresh_token,
		scope,
		expires_in
	} = overrideObj === null ? await twitch.exchangeCodeForToken(code) : overrideObj;
	await createOrUpdateUserFromTokenDetailed(access_token, expires_in, scope, refresh_token);
}

async function createOrUpdateUserFromOAuthToken(token) {
	let {scopes, expires_in} = await twitch.getTokenDetails(token);
	await createOrUpdateUserFromTokenDetailed(token, expires_in, scopes);
}

async function refreshUser() {
	// TODO: Implement
}

export {createOrUpdateUserFromAuthCode, createOrUpdateUserFromOAuthToken};
