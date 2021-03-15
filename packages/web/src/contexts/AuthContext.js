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
	firestore,
} from 'helpers/firebase'
import * as Cookies from 'helpers/Cookies'





// Constants
const INITIAL_STATE = {
	isLoaded: false,
	isLoggedIn: false,
	isLoggingIn: false,
	isLoggingOut: false,
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
		case 'attempt login':
			newState.isLoggedIn = false
			newState.isLoggingIn = true
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
	login: () => {},
	logout: () => {},
	register: () => {},
	validateEmail: () => {},
	validateUsername: () => {},
})

const AuthContextProvider = props => {
	const { children } = props
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

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
		const authToken = await user?.getIdToken()

		if (authToken) {
			Cookies.set('firebaseAuthToken', authToken)
		} else {
			Cookies.remove('firebaseAuthToken')
		}

		dispatch({
			payload: user,
			type: 'auth state changed',
		})
	}, [dispatch])

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
				login,
				logout,
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
