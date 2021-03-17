//import 3rd party
import {useCallback} from 'react'

//import local
import { useModals } from 'contexts/ModalsContext'
import { Button } from 'components/Button'

export function CampaignRewards() {
	const { openModal } = useModals()
	const handleCreateRewardClick = useCallback(() => openModal('reward'), [openModal])
	return (
		<>
			<h3 className="title">Rewards</h3>
			<Button
					className="is-primary"
					onClick={handleCreateRewardClick}>
					Create Reward
			</Button>
			<ul>
				<li>Show some Rewards here?</li>
			</ul>
		</>
	)
}
