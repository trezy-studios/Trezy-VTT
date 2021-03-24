// Local imports
import { RewardForm } from 'components/RewardForm'
import { Modal } from 'components/Modal'


export function RewardModal(props) {
    const {campaign, showModal} = props;
	return (
		<Modal
			name="reward"
			title="Create Reward"
            showModal={showModal}>
			<RewardForm campaign={campaign} showModal={showModal}/>
		</Modal>
	)
}
