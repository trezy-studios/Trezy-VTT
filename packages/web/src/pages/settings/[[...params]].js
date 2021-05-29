// Module imports
import { useRouter } from 'next/router'





// Local imports
import { SettingsGeneral } from 'components/SettingsPage/SettingsGeneral'
import { SettingsIntegrations } from 'components/SettingsPage/SettingsIntegrations'
import { SettingsMenu } from 'components/SettingsPage/SettingsMenu'
import { SettingsPassword } from 'components/SettingsPage/SettingsPassword'
import { useAuth } from 'contexts/AuthContext'
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function SettingsPage() {
	const { isLoggedIn } = useAuth()
	const Router = useRouter()
	const [ activeSetting ] = (Router.query?.params || [])

	useRedirectOnLoggedOut()

	return (
		<section className="section">
			<h2 className="title">
				Settings
			</h2>

			<hr />

			<div className="columns">
				<div className="column is-narrow">
					<SettingsMenu />
				</div>

				<div className="column">
					{!isLoggedIn && (
						<span>Loading...</span>
					)}

					{(isLoggedIn && (activeSetting === 'general')) && (
						<SettingsGeneral />
					)}

					{(isLoggedIn && (activeSetting === 'integrations')) && (
						<SettingsIntegrations />
					)}

					{(isLoggedIn && (activeSetting === 'password')) && (
						<SettingsPassword />
					)}
				</div>
			</div>
		</section>
	)
}
