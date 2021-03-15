// Local imports
import { CampaignForm } from 'components/CampaignForm'
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function CampaignPage() {
	useRedirectOnLoggedOut()

	return (
		<section className="section">
			<div className="columns">
				<div className="column is-half is-offset-one-quarter">
					<div className="box">
						<h2 className="title">Create Campaign</h2>

						<CampaignForm />
					</div>
				</div>
			</div>
		</section>
	)
}
