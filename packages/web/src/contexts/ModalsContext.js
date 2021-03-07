// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useReducer,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { LoginModal } from 'components/LoginModal'
import { RegistrationModal } from 'components/RegistrationModal'





// Constants
const INITIAL_STATE = {
	modalStates: {},
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
		case 'close modal':
			newState.modalStates = { ...newState.modalStates }
			delete newState.modalStates[payload]
			break

		case 'open modal':
			newState.modalStates = {
				...newState.modalStates,
				[payload]: true,
			}
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	return newState
}





const ModalsContext = createContext({
	...INITIAL_STATE,
	closeModal: () => {},
	openModal: () => {},
})

const ModalsContextProvider = props => {
	const { children } = props
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

	const closeModal = useCallback(modalName => {
		dispatch({
			payload: modalName,
			type: 'close modal',
		})
	}, [dispatch])
	const openModal = useCallback(modalName => {
		dispatch({
			payload: modalName,
			type: 'open modal',
		})
	}, [dispatch])

	return (
		<ModalsContext.Provider
			value={{
				...state,
				closeModal,
				openModal,
			}}>
			{children}

			{state.modalStates.login && (
				<LoginModal />
			)}

			{state.modalStates.registration && (
				<RegistrationModal />
			)}
		</ModalsContext.Provider>
	)
}

ModalsContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useModals = () => useContext(ModalsContext)





export {
	ModalsContext,
	ModalsContextProvider,
	useModals,
}
