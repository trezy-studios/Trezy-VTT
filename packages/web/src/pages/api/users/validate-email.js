// Local imports
import { auth } from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const { email } = request.query

	try {
		await auth.getUserByEmail(email)
		return response.status(httpStatus.FOUND).end()
	} catch (error) {
		if (error.errorInfo.code === 'auth/user-not-found') {
			return response.status(httpStatus.NO_CONTENT).end()
		}

		console.log(error)
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).end()
	}
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
