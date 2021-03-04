// Local imports
import { Button } from 'components/Button'
import { useAuth } from 'contexts/AuthContext'

export default function HomePage() {
	const {
		isLoggedIn,
		isLoggingIn,
		isLoggingOut,
		login,
		logout,
	} = useAuth()

	return (
		<section className="hero is-fullheight">
			<div className="hero-body">
				<div>
					<h2 className="title">Home</h2>
					<p className="subtitle">The place to be.</p>
				</div>
			</div>
		</section>
	)
}
