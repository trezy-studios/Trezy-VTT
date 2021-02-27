// Local imports
import {
	firebase,
	firestore,
} from 'helpers/firebase'

// Wrap it all in an `async` IIFE so we can simulate top-level `await`.
;(async () => {
	// Create a collection reference
	const campaignsCollection = firestore.collection('campaigns')

	// Create an object representing the new campaign locally
	const newCampaign = {
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
	const newRewardRef = await rewardsCollection.add({
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
	const newRewardDoc = await rewardsCollection.doc(newRewardRef.id).get()

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
	})

	console.log('Hello World')
})()
