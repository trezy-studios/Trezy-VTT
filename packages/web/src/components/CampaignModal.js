// Local imports
import { CampaignForm } from 'components/CampaignForm'
import { Modal } from 'components/Modal'





export function CampaignModal() {
	return (
		<Modal
			name="campaign"
			title="Create Campaign">
			<CampaignForm isModal />
		</Modal>
	)
}
