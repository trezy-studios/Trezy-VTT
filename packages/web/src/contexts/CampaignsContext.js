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
	campaigns: null,
	currentCampaignID: null,
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
		case 'unwatch campaign':
			newState.currentCampaignID = null
			break

		case 'update campaigns':
			newState.isLoaded = true
			newState.campaigns = generateStateFromSnapshotPatch(newState.campaigns, payload)
			break

		case 'update rewards':
			const campaign = newState.campaigns[newState.currentCampaignID]

			newState.campaigns = {
				...newState.campaigns,
				[newState.currentCampaignID]: {
					...campaign,
					rewards: generateStateFromSnapshotPatch(campaign.rewards || {}, payload),
				}
			}
			break

		case 'watch campaign':
			newState.currentCampaignID = payload
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	return newState
}





const CampaignsContext = createContext({
	...INITIAL_STATE,
	createCampaign: () => {},
	createReward: () => {},
	unwatchCampaign: () => {},
	watchCampaign: () => {},
})

const CampaignsContextProvider = props => {
	const { children } = props
	const {
		isLoaded: isAuthLoaded,
		isLoggedIn,
		user: currentUser,
	} = useAuth()
	const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE })

	/**
	 * Saves a new campaign to the firestore campaigns collection
	 * @param {*} campaign Campaign object that we expect to be populated
	 * with a name, game type, description, and owner ID
	 * @returns If successful, the ID of the new campaign object
	 * Otherwise, null
	 */
	const createCampaign = useCallback(async campaign => {
		const response = await API.post({
			body: campaign,
			route: '/campaigns/new',
		})
		const responseJSON = await response.json()

		return responseJSON.id
	}, [])

	const createReward = useCallback(async (reward, campaignID) => {
		const response = await API.post({
			body: {
				...reward,
				campaignID,
			},
			route: '/rewards/new',
		})
	}, [])

	const handleCampaignSnapshot = useCallback(snapshot => {
		const patch = generatePatchFromSnapshot(snapshot)

		if (patch.length) {
			dispatch({
				payload: patch,
				type: 'update campaigns',
			})
		}
	}, [dispatch])

	const handleRewardsSnapshot = useCallback(snapshot => {
		const patch = generatePatchFromSnapshot(snapshot)

		if (patch.length) {
			dispatch({
				payload: patch,
				type: 'update rewards',
			})
		}
	}, [])

	const watchCampaign = useCallback(campaignID => {
		dispatch({
			payload: campaignID,
			type: 'watch campaign',
		})
	}, [dispatch])

	const unwatchCampaign = useCallback(() => dispatch({ type: 'unwatch campaign' }), [dispatch])

	useEffect(() => {
		if (isAuthLoaded && isLoggedIn && currentUser) {
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
		currentUser,
		handleCampaignSnapshot,
		isLoggedIn,
	])

	useEffect(() => {
		if (state.currentCampaignID) {
			return firestore
				.collection('rewards')
				.where('campaignID', '==', state.currentCampaignID)
				.onSnapshot(handleRewardsSnapshot)
		}
	}, [
		state.currentCampaignID,
		handleRewardsSnapshot,
	])

	return (
		<CampaignsContext.Provider
			value={{
				...state,
				createCampaign,
				createReward,
				unwatchCampaign,
				watchCampaign,
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
