// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'





// Local imports
import { Button } from 'components/Button'
import { JSONPreview } from 'components/JSONPreview'
import { RewardModal } from 'components/RewardModal'
import { useCampaigns } from 'contexts/CampaignsContext'
import { useModals } from 'contexts/ModalsContext'





export function CampaignRewards(props) {
	const {
		campaigns,
		unwatchCampaign,
		watchCampaign,
	} = useCampaigns()
	const campaignID = props.campaign.id
	const campaign = campaigns[campaignID]
	const { openModal } = useModals()
	const [shouldShowRewardsModal, setShouldShowRewardsModal] = useState(false)
	const handleCreateRewardClick = () => setShouldShowRewardsModal(true)

	const mapReward = useCallback(([rewardID, reward]) => {
		return (
			<li key={rewardID}>
				<JSONPreview>{reward}</JSONPreview>
			</li>
		)
	}, [])

	useEffect(() => {
		watchCampaign(campaignID)
		return unwatchCampaign
	}, [])

	return (
		<>
			<h3 className="title">{'Rewards'}</h3>

			<Button
				className="is-primary"
				onClick={handleCreateRewardClick}>
				{'Create Reward'}
			</Button>

			{shouldShowRewardsModal && (
				<RewardModal
					campaign={{...campaign,id : campaignID}}
					showModal={setShouldShowRewardsModal} />
			)}

			<ul>
				{Object.entries(campaign.rewards || {}).map(mapReward)}
			</ul>
		</>
	)
}
