// Module imports
import {
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react'





// Local imports
import { firestore } from 'helpers/firebase'
import { generatePatchFromSnapshot } from 'helpers/generatePatchFromSnapshot'
import { generateStateFromSnapshotPatch } from 'helpers/generateStateFromSnapshotPatch'





// Constants
const INITIAL_STATE = {
	games: null,
	isLoaded: false, // Indicates that all core data has been loaded
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
		case 'update games':
			newState.games = generateStateFromSnapshotPatch(newState.games, payload)
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	if (newState.games) {
		newState.isLoaded = true
	}

	return newState
}





const CoreDataContext = createContext({ ...INITIAL_STATE })

const CoreDataContextProvider = props => {
	const { children } = props
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

	const getCoreDataCollection = useCallback(async collectionName => {
		const data = {}

		const result = await firestore
			.collection(collectionName)
			.get()

		result.forEach(doc => data[doc.id] = doc.data())

		dispatch({
			payload: data,
			type: `${collectionName} retrieval success`,
		})
	}, [dispatch])

	const getGames = useCallback(() => {
		getCoreDataCollection('games')
	}, [getCoreDataCollection])

	useEffect(() => {
		getGames()
	}, [getGames])

	return (
		<CoreDataContext.Provider value={{ ...state }}>
			{children}
		</CoreDataContext.Provider>
	)
}

CoreDataContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useCoreData = () => useContext(CoreDataContext)





export {
	CoreDataContext,
	CoreDataContextProvider,
	useCoreData,
}
