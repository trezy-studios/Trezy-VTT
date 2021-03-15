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
		<section className="section">
			<h2 className="title">Dashboard</h2>

			<Button
				className="is-primary"
				onClick={handleCreateCampaignClick}>
				Create Campaign
			</Button>
		</section>
	)
}
