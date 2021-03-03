// Local imports
import { createEndpoint } from 'helpers/createEndpoint'
import httpStatus from 'helpers/httpStatus'





export const handler = (request, response) => response.status(httpStatus.OK).end()





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
