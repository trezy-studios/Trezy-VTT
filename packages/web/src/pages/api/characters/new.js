// Local imports
import {
	auth,
	firebase,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const character = { ...request.body }
	const { firebaseAuthToken } = request.cookies

	try {
		const user = await auth.verifyIdToken(firebaseAuthToken, true)

		if (!character.name || !character.gameID) {
			response.status(httpStatus.UNPROCESSABLE_ENTITY).end()
		}

		const { DEFAULT_BUILD } = await import(`data/${character.gameID}/character-sheet.js`)

		character.build = DEFAULT_BUILD
		character.ownerID = user.uid
		character.createdAt = firebase.firestore.FieldValue.serverTimestamp()
		character.updatedAt = firebase.firestore.FieldValue.serverTimestamp()

		const newCharacter = await firestore
			.collection('characters')
			.add(character)

		response.status(httpStatus.PARTIAL_CONTENT).json({
			id: newCharacter.id,
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
