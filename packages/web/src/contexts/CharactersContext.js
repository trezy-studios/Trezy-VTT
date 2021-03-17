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
import { generatePatchFromSnapshot } from 'helpers/generatePatchFromSnapshot'
import { generateStateFromSnapshotPatch } from 'helpers/generateStateFromSnapshotPatch'
import { useAuth } from 'contexts/AuthContext'
import API from 'helpers/API'





// Constants
const INITIAL_STATE = {
	characters: null,
	isLoaded: false, // Indicates that the first load has occured
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
		case 'update characters':
			newState.isLoaded = true
			newState.characters = generateStateFromSnapshotPatch(newState.characters, payload)
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	return newState
}





const CharactersContext = createContext({
	...INITIAL_STATE,
	createCharacter: () => {},
})

const CharactersContextProvider = props => {
	const { children } = props
	const {
		isLoaded: isAuthLoaded,
		isLoggedIn,
		user: currentUser,
	} = useAuth()
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })


	/**
	 * Saves a new character to the firestore characters collection
	 * @param {*} character Character object that we expect to be populated
	 * with a name, game type, description, and owner ID
	 * @returns If successful, the ID of the new character object
	 * Otherwise, null
	 */
	const createCharacter = useCallback(async character => {
		const response = await API.post({
			body: character,
			route: '/characters/new',
		})
		const responseJSON = await response.json()

		return responseJSON.id
	}, [])

	const handleCharacterSnapshot = useCallback(snapshot => {
		const patch = generatePatchFromSnapshot(snapshot)

		if (patch.length) {
			dispatch({
				payload: patch,
				type: 'update characters',
			})
		}
	}, [dispatch])

	useEffect(() => {
		if (isAuthLoaded && isLoggedIn && currentUser) {
			return firestore
				.collection('characters')
				.where('ownerID', '==', currentUser.uid)
				.onSnapshot(handleCharacterSnapshot)
		}
	}, [
		currentUser,
		handleCharacterSnapshot,
		isLoggedIn,
	])

	return (
		<CharactersContext.Provider
			value={{
				...state,
				createCharacter,
			}}>
			{children}
		</CharactersContext.Provider>
	)
}

CharactersContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useCharacters = () => useContext(CharactersContext)





export {
	CharactersContext,
	CharactersContextProvider,
	useCharacters,
}
