// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from 'components/Button'
import { useModals } from 'contexts/ModalsContext'





export default function DashboardPage() {
	const {
		openModal,
	} = useModals()

	const handleCreateCampaignClick = useCallback(() => openModal('campaign'), [openModal])

	return (
		<div>
			<div>
				Dashboard
			</div>
			<div>
				<Button
					className="is-primary"
					onClick={handleCreateCampaignClick}>
					<strong>Create Campaign</strong>
				</Button>
			</div>
		</div>

	)
}
