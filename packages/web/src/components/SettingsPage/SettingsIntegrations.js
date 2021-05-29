// Local imports
import { convertObjectToQueryParams } from 'helpers/convertObjectToQueryParams'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useAuth } from 'contexts/AuthContext'





export function SettingsIntegrations() {
	const { user } = useAuth()

	const scopes = [
		'channel:manage:redemptions',
		'channel:read:redemptions',
	]

	const twitchURL = `https://id.twitch.tv/oauth2/authorize${convertObjectToQueryParams({
		client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
		redirect_uri: encodeURIComponent(process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI),
		response_type: 'code',
		scope: scopes.join(' '),
	})}`

	return (
		<>
			<h3 className="is-4 title">Integrations</h3>

			<a
				className="button"
				href={twitchURL}>
				<FontAwesomeIcon
					fixedWidth
					icon={['fab', 'twitch']} />
				Sign in with Twitch
			</a>
		</>
	)
}
