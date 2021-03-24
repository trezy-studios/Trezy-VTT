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
			<div>Loading...</div>
		)
	}

	return (
		<ul className="columns is-multiline">
			{Object.entries(campaigns).map(mapCampaignItem)}
		</ul>
	)
}
