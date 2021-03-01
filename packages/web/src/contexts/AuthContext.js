// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useReducer,
} from 'react'
import PropTypes from 'prop-types'





// Constants
const INITIAL_STATE = {
	isLoggedIn: false,
	isLoggingIn: false,
	isLoggingOut: false,
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

		case 'attempt logout':
			newState.isLoggingOut = true
			break

		case 'login failure':
			newState.isLoggedIn = false
			newState.isLoggingIn = false
			break

		case 'logout success':
			newState.isLoggedIn = false
			newState.isLoggingOut = false
			break

		case 'logout failure':
			newState.isLoggedIn = true
			newState.isLoggingOut = false
			break

		case 'login success':
			newState.isLoggedIn = true
			newState.isLoggingIn = false
			break

		default:
			throw new Error(`Unrecognized action dispatched: ${type}`, payload)
	}

	return newState
}





const AuthContext = createContext({
	...INITIAL_STATE,
	login: () => {},
	logout: () => {},
})

const AuthContextProvider = props => {
	const { children } = props
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

	const login = useCallback(async (email, password) => {
		dispatch({ type: 'attempt login' })

		try {
			// await auth.login()
			return dispatch({ type: 'login success' })
		} catch (error) {
			return dispatch({ type: 'login failure' })
		}
	}, [dispatch])

	const logout = useCallback(async (email, password) => {
		dispatch({ type: 'attempt logout' })

		try {
			// await auth.logout()
			return dispatch({ type: 'logout success' })
		} catch (error) {
			return dispatch({ type: 'logout failure' })
		}
	}, [dispatch])

	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				logout,
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
