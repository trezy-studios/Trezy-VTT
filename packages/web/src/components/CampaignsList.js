// Local imports
import { CampaignSummary } from 'components/CampaignSummary'
import { useCampaigns } from 'contexts/CampaignsContext'





function mapCampaignItem([id, campaign]) {
	return (
		<li
			className="column is-full-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
			key={id}>
			<CampaignSummary
				id={id}
				campaign={campaign} />
		</li>
	)
}

export function CampaignsList() {
	const {
		campaigns,
		isLoaded: isCampaignsLoaded,
	} = useCampaigns()

	if (!isCampaignsLoaded) {
		return (
			<div className="box has-text-centered has-text-grey">
				<progress class="progress is-small is-primary" />
				{'Loading...'}
			</div>
		)
	}

	if (isCampaignsLoaded && !campaigns) {
		return (
			<div className="box has-text-centered has-text-grey">
				{'You haven\'t created or joined any campaigns... yet.'}
			</div>
		)
	}

	return (
		<ul className="columns is-multiline">
			{Object.entries(campaigns).map(mapCampaignItem)}
		</ul>
	)
}
