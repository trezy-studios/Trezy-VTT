// Local imports
import {
	auth,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const {
		email,
		password,
		username,
	} = request.body

	try {
		const { uid } = await auth.createUser({
			disabled: false,
			displayName: username,
			email,
			emailVerified: false,
			password,
		})
		const [profile, settings] = await Promise.all([
			firestore
				.collection('profiles')
				.doc(uid)
				.set({ username }),

			firestore
				.collection('settings')
				.doc(uid)
				.set({ theme: 'system' }),
		])

		console.log({
			uid,
			profile,
			settings,
		})
		response.status(httpStatus.CREATED).end()
	} catch (error) {
		console.log(error)

		if (error.errorInfo?.code) {
			switch (error.errorInfo.code) {
				case 'auth/email-already-exists':
					return response.status(httpStatus.FORBIDDEN).json({
						errors: [error.errorInfo.code]
					})
					break

				case 'auth/invalid-password':
					return response.status(httpStatus.UNPROCESSABLE_ENTITY).json({
						errors: [error.errorInfo.code]
					})
					break

				default:
					return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
						errors: [error.errorInfo.code],
					})
			}
		}

		return response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
			errors: [error],
		})
	}
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
