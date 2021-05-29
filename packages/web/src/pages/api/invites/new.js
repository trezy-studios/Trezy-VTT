// Local imports
import {
	auth,
	firebase,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const invite = { ...request.body }
	const { firebaseAuthToken } = request.cookies

	try {
		const user = await auth.verifyIdToken(firebaseAuthToken, true)

		if (!invite.email || !invite.campaignID) {
			response.status(httpStatus.UNPROCESSABLE_ENTITY).end()
		}

		const invitesCollection = firestore.collection('invites')
        invite.userid = null
		invite.createdAt = firebase.firestore.FieldValue.serverTimestamp()

		const newInvite = await invitesCollection.add(invite)

		response.status(httpStatus.PARTIAL_CONTENT).json({
			id: newInvite.id,
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
