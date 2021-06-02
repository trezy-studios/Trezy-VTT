// Module imports
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'





export function CampaignSummary(props) {
	const {
		campaign,
		id,
	} = props

	return (
		<div className="card">
			<div className="card-image">
				<figure className="image">
					<img src="/images/games/dnd5e/Illo2.jpg" alt="Blep" />
				</figure>
			</div>

			<div className="card-content">
				<div className="content">
					<header className="title">
						{campaign.name}
					</header>

					<ReactMarkdown>{campaign.description}</ReactMarkdown>
				</div>

				<div className="media">
					<div className="media-left">
						<figure className="image is-48x48">
							<img src="/images/games/dnd5e/logo.svg" alt="Dungeons &amp; Dragons: Fifth Edition logo" />
						</figure>
					</div>

					<div className="media-content">
						<p className="title is-4">Dungeons &amp; Dragons: Fifth Edition</p>
						<p className="subtitle is-6"><a href="https://dnd.wizards.com">https://dnd.wizards.com</a></p>
					</div>
				</div>
			</div>

			<footer className="card-footer">
				{Boolean(campaign.playerIDs?.length) && (
					<span className="card-footer-item">{campaign.playerIDs.length} Players</span>
				)}

				<Link href={`/campaigns/${id}`}>
					<a className="card-footer-item">View Dashboard</a>
				</Link>
			</footer>
		</div>
	)
}
