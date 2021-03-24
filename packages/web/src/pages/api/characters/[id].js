// Local imports
import {
	auth,
	firebase,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





// Constants
const CHANGEABLE_KEYS = [
	'build',
	'gameID',
	'name',
]





export const handler = async (request, response) => {
	const characterID = request.query.id
	const updates = { ...request.body }
	const { firebaseAuthToken } = request.cookies

	const disallowedKeys = Object.keys(updates).reduce((accumulator, key) => {
		if (!CHANGEABLE_KEYS.includes(key)) {
			accumulator.push(key)
		}

		return accumulator
	}, [])

	if (disallowedKeys.length) {
		return response.status(httpStatus.FORBIDDEN).json({
			errors: [
				`Attempted to set values for disallowed keys: ${disallowedKeys.join(', ')}`
			],
		})
	}

	try {
		await auth.verifyIdToken(firebaseAuthToken, true)

		const characterRef = firestore.collection('characters').doc(characterID)
		const oldCharacter = await characterRef.get()

		await characterRef.update({
			...updates,
			build: {
				...oldCharacter.data().build,
				...(updates.build || {}),
			},
			updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
		})

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
	allowedMethods: ['put'],
	handler,
})
