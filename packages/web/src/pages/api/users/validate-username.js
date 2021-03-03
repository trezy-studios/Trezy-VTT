// Local imports
import {
	auth,
	firestore,
} from 'helpers/firebase.admin'
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = async (request, response) => {
	const { username } = request.query

	try {
		const users = await firestore
			.collection('profiles')
			.where('username', '==', username)
			.get()

		if (users.size) {
			return response.status(httpStatus.FOUND).end()
		}

		return response.status(httpStatus.NO_CONTENT).end()
	} catch (error) {
		console.log(error)
		return response.status(httpStatus.INTERNAL_SERVER_ERROR).end()
	}
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
