import {firestore, firebase} from './firebase'


/**
 * Saves a campaign to the Firestore campaigns collection
 * @param {*} campaign - The campaign object to be saved. We expect this campaign object
 * to be populated with all relevant properties checked in validateCampaign
 * @returns If successful, returns the campaign object saved
 * Otherwise, returns rejected promise
 */
export async function saveCampaign(campaign) {
	if (!validateCampaign(campaign)) {
		return Promise.reject('Invalid campaign object')
	}

	let campaignToSave = firestore.collection('campaigns').doc(campaign.id)

	try {
		await campaignToSave.set({
			'name': campaign.name,
			'description': campaign.description,
			'gameType': campaign.gameType,
			'ownerID': campaign.ownerID,
			'createdAt': campaign.createdAt ?? firebase.firestore.Timestamp.now(),
			'updatedAt': firebase.firestore.Timestamp.now(),
			'isActive': campaign.isActive
		})
		return campaignToSave
	} catch {
		return Promise.reject('Failed to save campaign to Firestore')
	}
}

/**
 * Saves a new campaign to the firestore campaigns collection
 * @param {*} newCampaign Campaign object that we expect to be populated
 * with a name, game type, description, and owner ID
 * @returns If successful, The new campaign object added
 * Otherwise, null
 */
export async function createCampaign(newCampaign) {
	newCampaign.isActive = false
	let activeCampaigns = await firestore.collection('campaigns')
		.where('ownerID', '==', newCampaign.ownerID)
		.where('isActive', '==', true)
		.get()

	if (activeCampaigns.docs.length === 0) {
		newCampaign.isActive = true
	}
	newCampaign.id = firestore.collection('campaigns').doc().id
	return saveCampaign(newCampaign)
}

/**
 * Validates that an object is valid for saving to the Firestore campaigns collection
 * To-do: Convince Trezy that using TS for Type-checking database objects is worthwhile
 * @param {*} campaign
 * @returns True if campaign object is valid. Otherwise false
 */
export function validateCampaign(campaign) {
	if (typeof campaign.id !== 'string') {
		return false
	}

	if (typeof campaign.name !== 'string') {
		return false
	}

	if (typeof campaign.description !== 'string') {
		return false
	}

	if (typeof campaign.gameType !== 'string') {
		return false
	}

	if (typeof campaign.isActive !== 'boolean') {
		return false
	}

	if (typeof campaign.ownerID !== 'string') {
		return false
	}

	return true
}
