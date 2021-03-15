// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from 'components/Button'
import { CampaignsList } from 'components/CampaignsList'
import { useModals } from 'contexts/ModalsContext'





export default function DashboardPage() {
	const { openModal } = useModals()

	const handleCreateCampaignClick = useCallback(() => openModal('campaign'), [openModal])

	return (
		<section className="section">
			<header className="level">
				<h2 className="title level-left">
					Dashboard
				</h2>

				<Button
					className="is-primary  level-right"
					onClick={handleCreateCampaignClick}>
					Create Campaign
				</Button>
			</header>

			<CampaignsList />
		</section>
	)
}
