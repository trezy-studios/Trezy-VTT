// Local imports
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function DashboardPage() {
	useRedirectOnLoggedOut()

	return (
		<section className="section">
			<h2 className="title">
				Dashboard
			</h2>
		</section>
	)
}
