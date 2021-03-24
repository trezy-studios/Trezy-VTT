// Local imports
import {
	auth,
	firebase,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const reward = { ...request.body }
	const { firebaseAuthToken } = request.cookies

	try {
		const user = await auth.verifyIdToken(firebaseAuthToken, true)

		if (!reward.title || !reward.cost) {
			return response.status(httpStatus.UNPROCESSABLE_ENTITY).end()
		}

		const campaignRef = firestore.collection('campaigns').doc(reward.campaignID)
		const campaignDoc = await campaignRef.get()
		const campaign = campaignDoc.data()

		if (campaign.ownerID !== user.uid) {
			return response.status(httpStatus.FORBIDDEN).end()
		}

		const removableFields = ['cooldown', 'maxRedemptions']

		removableFields.forEach(key => {
			if (reward[key] === 0) {
				delete reward[key]
			}
		})

		reward.createdAt = firebase.firestore.FieldValue.serverTimestamp()
		reward.isSynced = true
		reward.lastSync = firebase.firestore.FieldValue.serverTimestamp()
		reward.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

		await campaignRef.collection('rewards').add(reward)

		response.status(httpStatus.OK).end()
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
