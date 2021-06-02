// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
	useRef,
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
	isSavingCharacterSheets: {},
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
	let characterSheet = null

	switch (type) {
		case 'character sheet saved':
			newState.isSavingCharacterSheets = { ...newState.isSavingCharacterSheets }
			delete newState.isSavingCharacterSheets[payload]
			break

		case 'saving character sheet':
			newState.isSavingCharacterSheets = {
				...newState.isSavingCharacterSheets,
				[payload]: true,
			}
			break

		case 'loaded characters':
			newState.isLoaded = true
			break

		case 'update characters':
			newState.isLoaded = true
			newState.characters = generateStateFromSnapshotPatch(newState.characters, payload.patch)
			Object.values(newState.characters).forEach(character => {
				const {
					build,
					gameID,
				} = character
				const CharacterSheet = payload.characterSheets[gameID]
				character.characterSheet = new CharacterSheet(build)
			})
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
	updateCharacterSheet: () => {},
})

const CharactersContextProvider = props => {
	const { children } = props
	const {
		isLoaded: isAuthLoaded,
		isLoggedIn,
		user: currentUser,
	} = useAuth()
	const characterSheets = useRef({})
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

	const updateCharacterSheet = useCallback(async (characterID, characterSheetPatch) => {
		dispatch({
			payload: characterID,
			type: 'saving character sheet',
		})

		const response = await API.put({
			body: {
				build: characterSheetPatch,
			},
			route: `/characters/${characterID}`,
		})

		dispatch({
			payload: characterID,
			type: 'character sheet saved',
		})
	}, [dispatch])

	const handleCharacterSnapshot = useCallback(async snapshot => {
		if (snapshot.size) {
		const patch = generatePatchFromSnapshot(snapshot)

		// Retrieve CharacterSheets for any games that we haven't loaded yet
		snapshot.docChanges().forEach(change => {
			const {
				doc,
				type,
			} = change

			if (type !== 'added') {
				return
			}

			const { gameID } = doc.data()

			if (!characterSheets.current[gameID]) {
				characterSheets.current[gameID] = (async () => {
					const result = await import(`data/${gameID}/character-sheet`)
					return result.CharacterSheet
				})()
			}
		})

		const characterSheetResults = await Promise.all(Object.values(characterSheets.current))
		Object.keys(characterSheets.current).forEach((key, index) => {
			characterSheets.current[key] = characterSheetResults[index]
		})

			dispatch({
				payload: {
					characterSheets: characterSheets.current,
					patch,
				},
				type: 'update characters',
			})
		} else {
			dispatch({ type: 'loaded characters' })
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
				updateCharacterSheet,
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
