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

		if (!reward.title || !reward.cost || reward.uid !== user.uid) {
			response.status(httpStatus.UNPROCESSABLE_ENTITY).end()
		}
        
		const rewardsCollection = firestore
                                    .collection('campaigns')
                                    .doc(reward.campaignID)
                                    .collection('rewards')

        delete reward.campaignID
        delete reward.uid
		reward.createdAt = firebase.firestore.FieldValue.serverTimestamp()
	    reward.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

		const newReward = await rewardsCollection.add(reward)

		response.status(httpStatus.PARTIAL_CONTENT).json({
			id: newReward.id,
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
