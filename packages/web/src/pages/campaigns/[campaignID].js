// Module imports
import { useRouter } from 'next/router'





export default function CampaignDashboardPage() {
	const { query } = useRouter()

	return (
		<section className="section">
			<h2 className="title">Campaign Name</h2>

			<dl>
				<dt>ID</dt>
				<dd>{query.campaignID}</dd>
			</dl>
		</section>
	)
}
