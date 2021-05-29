// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import {
	auth,
	firebase,
	firestore,
} from 'helpers/firebase'
import { useNotifications } from 'contexts/NotificationsContext'
import * as Cookies from 'helpers/Cookies'





// Constants
const INITIAL_STATE = {
	isChangingPassword: false,
	isLoaded: false,
	isLoggedIn: false,
	isLoggingIn: false,
	isLoggingOut: false,
	isReauthenticating: false,
	isReauthenticationRequired: false,
	isRegistering: false,
	profile: null,
	settings: null,
	user: null,
}





function reducer(state, action) {
	const {
		payload,
		type,
	} = action
	const newState = {
		...INITIAL_STATE,
		...state,
	}

	switch (type) {
		case 'attempt change password':
			newState.isChangingPassword = true
			break

		case 'attempt login':
			newState.isLoggedIn = false
			newState.isLoggingIn = true
			break

		case 'attempt reauthentication':
			newState.isReauthenticating = true
			break

		case 'attempt registration':
			newState.isRegistering = true
			break

		case 'attempt logout':
			newState.isLoggingOut = true
			break

		case 'auth state changed':
			if (payload) {
				newState.isLoggedIn = true
				newState.user = payload
			} else {
				newState.isLoggedIn = false
				newState.profile = null
				newState.settings = null
				newState.user = null
			}

			newState.isLoaded = true
			newState.isLoggingIn = false
			newState.isLoggingOut = false
			newState.isRegistering = false
			break

		case 'change password failure':
			if (payload.reauthenticationRequired) {
				newState.isReauthenticationRequired = true
			} else {
				newState.isChangingPassword = false
			}
			break

		case 'change password success':
			newState.isChangingPassword = false
			break

		case 'login failure':
			newState.isLoggedIn = false
			newState.isLoggingIn = false
			break

		case 'login success':
			newState.isLoggedIn = true
			newState.isLoggingIn = false
			break

		case 'logout failure':
			newState.isLoggedIn = true
			newState.isLoggingOut = false
			break

		case 'logout success':
			newState.isLoggedIn = false
			newState.isLoggingOut = false
			break

		case 'profile loaded':
			newState.profile = payload
			break

		case 'settings loaded':
			newState.settings = payload
			break

		case 'reauthentication failure':
			newState.isReauthenticating = false
			break

		case 'reauthentication success':
			newState.isReauthenticating = false
			newState.isReauthenticationRequired = false
			break

		case 'registration failure':
			newState.isRegistering = true
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	return newState
}





const AuthContext = createContext({
	...INITIAL_STATE,
	changePassword: () => {},
	login: () => {},
	logout: () => {},
	reauthenticate: () => {},
	register: () => {},
	validateEmail: () => {},
	validateUsername: () => {},
})

const AuthContextProvider = props => {
	const { children } = props
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })
	const { addNotification } = useNotifications()

	const changePassword = useCallback(async password => {
		dispatch({ type: 'attempt change password' })

		try {
			await auth.currentUser.updatePassword(password)
			dispatch({ type: 'change password success' })
			addNotification({
				title: 'Password changed!',
				message: 'You can now use your new password on your next login. 😁',
				type: 'success',
			})
		} catch (error) {
			if (error.code === 'auth/requires-recent-login') {
				return dispatch({
					payload: {
						reauthenticationRequired: true,
					},
					type: 'change password failure',
				})
			}

			dispatch({ type: 'change password failure' })
			addNotification({
				title: 'Password change failed',
				message: `Something went wrong. Please try again.\nCode: ${error.code}`,
				type: 'danger',
			})
		}
	}, [dispatch])

	const validateEmail = useCallback(async email => {
		let response = null

		try {
			response = await fetch(`/api/users/validate-email?email=${email}`)
		} catch (error) {}

		if (response.status === 204) {
			return true
		}

		return false
	}, [])

	const validateUsername = useCallback(async username => {
		let response = null

		try {
			response = await fetch(`/api/users/validate-username?username=${username}`)
		} catch (error) {}

		if (response.status === 204) {
			return true
		}

		return false
	}, [])

	const handleAuthStateChanged = useCallback(async user => {
		dispatch({
			payload: user,
			type: 'auth state changed',
		})
	}, [dispatch])

	const handleIDTokenChange = useCallback(async user => {
		if (user) {
			const idToken = await user.getIdToken()

			Cookies.set('firebaseAuthToken', idToken, {
				maxAge: 60 * 60 * 24 * 30,
				path: '/',
			})
		} else {
			Cookies.remove('firebaseAuthToken')
		}
	}, [])

	const handleProfileSnapshot = useCallback(snapshot => {
		dispatch({
			payload: snapshot.data(),
			type: 'profile loaded',
		})
	}, [dispatch])

	const handleSettingsSnapshot = useCallback(snapshot => {
		dispatch({
			payload: snapshot.data(),
			type: 'settings loaded',
		})
	}, [dispatch])

	const login = useCallback(async (email, password) => {
		dispatch({ type: 'attempt login' })

		try {
			await auth.signInWithEmailAndPassword(email, password)
			return dispatch({ type: 'login success' })
		} catch (error) {
			return dispatch({ type: 'login failure' })
		}
	}, [dispatch])

	const logout = useCallback(async () => {
		dispatch({ type: 'attempt logout' })

		try {
			await auth.signOut()
			return dispatch({ type: 'logout success' })
		} catch (error) {
			return dispatch({ type: 'logout failure' })
		}
	}, [dispatch])

	const reauthenticate = useCallback(async password => {
		try {
			dispatch({ type: 'attempt reauthentication' })

			const credential = firebase.auth.EmailAuthProvider.credential(
				auth.currentUser.email,
				password,
			)
			await auth.currentUser.reauthenticateWithCredential(credential)

			dispatch({ type: 'reauthentication success' })
		} catch (error) {
			console.log({error})
			dispatch({ type: 'reauthentication failure' })
		}
	}, [
		dispatch,
		login,
	])

	const register = useCallback(async user => {
		dispatch({ type: 'attempt registration' })

		try {
			await fetch('/api/users/register', {
				body: JSON.stringify(user),
				headers: { 'Content-Type': 'application/json' },
				method: 'post',
			})
			await login(user.email, user.password)
		} catch (error) {
			return dispatch({ type: 'registration failure' })
		}
	}, [dispatch])

	useEffect(() => auth.onAuthStateChanged(handleAuthStateChanged), [handleAuthStateChanged])
	useEffect(() => auth.onIdTokenChanged(handleIDTokenChange), [handleIDTokenChange])

	useEffect(() => {
		const { uid } = state.user || {}

		if (state.user) {
			const unsubscribers = []

			unsubscribers.push(firestore
				.collection('profiles')
				.doc(uid)
				.onSnapshot(handleProfileSnapshot))

			unsubscribers.push(firestore
				.collection('settings')
				.doc(uid)
				.onSnapshot(handleSettingsSnapshot))

			return () => unsubscribers.forEach(unsubscriber => unsubscriber())
		}
	}, [
		handleProfileSnapshot,
		handleSettingsSnapshot,
		state.user,
	])

	return (
		<AuthContext.Provider
			value={{
				...state,
				changePassword,
				login,
				logout,
				reauthenticate,
				register,
				validateEmail,
				validateUsername,
			}}>
			{children}
		</AuthContext.Provider>
	)
}

AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useAuth = () => useContext(AuthContext)





export {
	AuthContext,
	AuthContextProvider,
	useAuth,
}
