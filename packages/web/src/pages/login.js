// Local imports
import { LoginForm } from 'components/LoginForm'
import { useRedirectOnLoggedIn } from 'hooks/useRedirectOnLoggedIn'





export default function LoginPage() {
	useRedirectOnLoggedIn()

	return (
		<section className="section">
			<div className="columns">
				<div className="column is-half is-offset-one-quarter">
					<div className="box">
						<h2 className="title">Login</h2>

						<LoginForm />
					</div>
				</div>
			</div>
		</section>
	)
}
