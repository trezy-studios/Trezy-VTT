// Local imports
import { RewardForm } from 'components/RewardForm'
import { Modal } from 'components/Modal'


export function RewardModal() {
	return (
		<Modal
			name="reward"
			title="Create Reward">
			<RewardForm isModal />
		</Modal>
	)
}
