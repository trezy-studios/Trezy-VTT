// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useState,
} from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'





// Constants
const NOTIFICATION_TIMEOUT = 5000
const NotificationsContext = createContext({
	notifications: [],
	addNotification: () => {},
	closeNotification: () => {},
})





const NotificationsContextProvider = props => {
	const { children } = props
	const [notifications, setNotifications] = useState([])

	const addNotification = useCallback(notification => {
		const id = uuid()

		setNotifications(previousState => {
			return [
				...previousState,
				{
					...notification,
					id,
				},
			]
		})

		setTimeout(() => {
			closeNotification({ id })
		}, NOTIFICATION_TIMEOUT)

		return id
	}, [setNotifications])

	const closeNotification = useCallback(notification => {
		setNotifications(previousState => {
			return previousState.filter(({ id }) => id !== notification.id)
		})
	}, [setNotifications])

	return (
		<NotificationsContext.Provider
			value={{
				addNotification,
				closeNotification,
				notifications,
			}}>
			{children}
		</NotificationsContext.Provider>
	)
}

NotificationsContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useNotifications = () => useContext(NotificationsContext)





export {
	NotificationsContext,
	NotificationsContextProvider,
	useNotifications,
}
