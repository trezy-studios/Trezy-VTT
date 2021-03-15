// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from 'components/Button'
import { CampaignsList } from 'components/CampaignsList'
import { useModals } from 'contexts/ModalsContext'
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function DashboardPage() {
	const { openModal } = useModals()

	const handleCreateCampaignClick = useCallback(() => openModal('campaign'), [openModal])

	useRedirectOnLoggedOut()

	return (
		<section className="section">
			<header className="level">
				<h2 className="title level-left">
					Dashboard
				</h2>

				<Button
					className="is-primary level-right"
					onClick={handleCreateCampaignClick}>
					Create Campaign
				</Button>
			</header>

			<CampaignsList />
		</section>
	)
}
