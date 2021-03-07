// Local imports
import { RegistrationForm } from 'components/RegistrationForm'
import { useRedirectOnLoggedIn } from 'hooks/useRedirectOnLoggedIn'





export default function RegistrationPage() {
	useRedirectOnLoggedIn()

	return (
		<section className="section">
			<div className="columns">
				<div className="column is-half is-offset-one-quarter">
					<div className="box">
						<h2 className="title">Sign up</h2>

						<RegistrationForm />
					</div>
				</div>
			</div>
		</section>
	)
}
