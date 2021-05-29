// Local imports
import { auth } from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const errors = []
	const { firebaseAuthToken } = request.cookies
	const { password } = request.body

	try {
		const user = await auth.verifyIdToken(firebaseAuthToken, true)

		await auth.updateUser(user.uid, { password })

		return response.status(httpStatus.OK).end()
	} catch (error) {
		console.log(error)
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).end()
	}
}





export default createEndpoint({
	allowedMethods: ['post'],
	handler,
})
