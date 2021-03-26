// Local imports
import {
	auth,
	firebase,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const campaign = { ...request.body }
	const { firebaseAuthToken } = request.cookies

	try {
		const user = await auth.verifyIdToken(firebaseAuthToken, true)

		if (!campaign.gameID || !campaign.name) {
			response.status(httpStatus.UNPROCESSABLE_ENTITY).end()
		}

		const campaignsCollection = firestore.collection('campaigns')

		const activeCampaigns = await campaignsCollection
			.where('ownerID', '==', user.uid)
			.where('isActive', '==', true)
			.get()

		campaign.isActive = !activeCampaigns.docs.length
		campaign.isSynced = true
		campaign.ownerID = user.uid
		campaign.playerIDs = []

		campaign.createdAt = firebase.firestore.FieldValue.serverTimestamp()
		campaign.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

		const newCampaign = await campaignsCollection.add(campaign)

		response.status(httpStatus.PARTIAL_CONTENT).json({
			id: newCampaign.id,
		})
	} catch (error) {
		console.log(error)

		switch (error.errorInfo.code) {
			default:
				response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
					errors: [error.errorInfo.code],
				})
		}
	}
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
