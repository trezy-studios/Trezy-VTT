// Module imports
import { useRouter } from 'next/router'
import classnames from 'classnames'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'





// Local imports
import { Button } from 'components/Button'
import { CampaignDescription } from 'components/CampaignPage/CampaignDescription'
import { CampaignMaps } from 'components/CampaignPage/CampaignMaps'
import { CampaignNPCs } from 'components/CampaignPage/CampaignNPCs'
import { CampaignPCs } from 'components/CampaignPage/CampaignPCs'
import { CampaignPlayerList } from 'components/CampaignPage/CampaignPlayerList'
import { CampaignRewards } from 'components/CampaignPage/CampaignRewards'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useCampaigns } from 'contexts/CampaignsContext'
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function CampaignDashboardPage() {
	const Router = useRouter()
	const [
		campaignID,
		activeTab = 'maps',
	] = (Router.query?.params || [])
	const {
		campaigns,
		isLoaded: isCampaignsLoaded,
	} = useCampaigns()

	useRedirectOnLoggedOut()

	const campaign = campaigns?.[campaignID]
	// TODO: These should be derived from a game object in our database, keyed off the `gameID` field on the campaign
	const gameTitle = 'Dungeons & Dragons: Fifth Edition'
	const gameURL = 'https://dnd.wizards.com'

	return (
		<section className="section">
			{!isCampaignsLoaded && (
				<div>{'Loading...'}</div>
			)}

			{isCampaignsLoaded && (
				<>
					<h2 className="title">{campaign.name}</h2>
					<p className="subtitle">
						{'A '}
						<a href={gameURL}>{gameTitle}</a>
						{' Game'}
					</p>

					<hr />

					<div className="columns">
						<div className="column is-one-quarter">
							<ul className="card-list">
								<li>
									<CampaignDescription description={campaign.description} />
								</li>

								<li>
									<CampaignPlayerList players={campaign.playerIDs || []} />
								</li>
							</ul>
						</div>

						<div className="column is-three-quarters">
							<div className="tabs">
								<ul>
									<li
										className={classnames({
											'is-active': activeTab === 'maps',
										})}>
										<Link
											href={`/campaigns/${campaignID}/maps`}
											shallow>
											<a>Maps</a>
										</Link>
									</li>

									<li
										className={classnames({
											'is-active': activeTab === 'pcs',
										})}>
										<Link
											href={`/campaigns/${campaignID}/pcs`}
											shallow>
											<a>PCs</a>
										</Link>
									</li>

									<li
										className={classnames({
											'is-active': activeTab === 'npcs',
										})}>
										<Link
											href={`/campaigns/${campaignID}/npcs`}
											shallow>
											<a>NPCs</a>
										</Link>
									</li>

									<li
										className={classnames({
											'is-active': activeTab === 'rewards',
										})}>
										<Link
											href={`/campaigns/${campaignID}/rewards`}
											shallow>
											<a>Rewards</a>
										</Link>
									</li>
								</ul>
							</div>

							{(activeTab === 'maps') && (
								<CampaignMaps />
							)}

							{(activeTab === 'pcs') && (
								<CampaignPCs />
							)}

							{(activeTab === 'npcs') && (
								<CampaignNPCs />
							)}

							{(activeTab === 'rewards') && (
								<CampaignRewards campaign={{id: campaignID, ownerID: campaign.ownerID}} />
							)}
						</div>
					</div>
				</>
			)}
		</section>
	)
}
