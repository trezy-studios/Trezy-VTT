// Module imports
import { useRouter } from 'next/router'





// Local imports
import {
	Menu,
	MenuLink,
	MenuSection,
} from 'components/Menu'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





export function SettingsMenu() {
	const Router = useRouter()
	const [ activeSetting ] = (Router.query?.params || [])

	return (
		<Menu>
			<MenuSection label="Account">
				<MenuLink
					href="/settings/general"
					isActive={activeSetting === 'general'}>
					General
				</MenuLink>

				<MenuLink
					href="/settings/integrations"
					isActive={activeSetting === 'integrations'}>
					Integrations
				</MenuLink>

				<MenuLink
					href="/settings/password"
					isActive={activeSetting === 'password'}>
					Password
				</MenuLink>
			</MenuSection>

			<MenuSection label="Preferences">
				<MenuLink
					href="/settings/theme"
					isActive={activeSetting === 'theme'}>
					Theme
				</MenuLink>
			</MenuSection>
		</Menu>
	)
}
