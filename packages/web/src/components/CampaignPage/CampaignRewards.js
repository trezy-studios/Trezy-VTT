//import 3rd party
import {useCallback, useState} from 'react'

//import local
import { useModals } from 'contexts/ModalsContext'
import { Button } from 'components/Button'
import {RewardModal} from 'components/RewardModal'

export function CampaignRewards(props) {
	const { campaign } = props
	const { openModal } = useModals()
	const [shouldShowRewardsModal, setShouldShowRewardsModal] = useState(false)
	const handleCreateRewardClick = () => setShouldShowRewardsModal(true)

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
					campaign={campaign}
					showModal={setShouldShowRewardsModal} />
			)}

			<ul>
				<li>{'Show some Rewards here?'}</li>
			</ul>
		</>
	)
}
