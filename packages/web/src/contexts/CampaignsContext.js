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





// Constants
const INITIAL_STATE = {
	campaigns: null,
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
		case 'update campaigns':
			newState.isLoaded = true
			newState.campaigns = generateStateFromSnapshotPatch(newState.campaigns, payload)
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	return newState
}





const CampaignsContext = createContext({
	...INITIAL_STATE,
})

const CampaignsContextProvider = props => {
	const { children } = props
	const {
		isLoaded: isAuthLoaded,
		isLoggedIn,
		user: currentUser,
	} = useAuth()
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

	const handleCampaignSnapshot = useCallback(snapshot => {
		const patch = generatePatchFromSnapshot(snapshot)

		if (patch.length) {
			dispatch({
				payload: patch,
				type: 'update campaigns',
			})
		}
	}, [dispatch])

	useEffect(() => {
		if (isAuthLoaded && isLoggedIn) {
			const unsubscribers = []

			const ownedCampaignsWatcher = firestore
				.collection('campaigns')
				.where('ownerID', '==', currentUser.uid)
				.onSnapshot(handleCampaignSnapshot)

			const playerCampaignsWatcher = firestore
				.collection('campaigns')
				.where('playerIDs', 'array-contains', currentUser.uid)
				.onSnapshot(handleCampaignSnapshot)

			unsubscribers.push(ownedCampaignsWatcher)
			unsubscribers.push(playerCampaignsWatcher)

			return () => unsubscribers.forEach(unsubscribe => unsubscribe())
		}
	}, [
		handleCampaignSnapshot,
		isLoggedIn,
	])

	return (
		<CampaignsContext.Provider
			value={{
				...state,
			}}>
			{children}
		</CampaignsContext.Provider>
	)
}

CampaignsContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

const useCampaigns = () => useContext(CampaignsContext)





export {
	CampaignsContext,
	CampaignsContextProvider,
	useCampaigns,
}
