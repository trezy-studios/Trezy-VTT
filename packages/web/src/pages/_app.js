// Style imports
import 'scss/lib.scss'
import 'scss/app.scss'





// Local imports
import { AuthContextProvider } from 'contexts/AuthContext'
import { Banner } from 'components/Banner'
import { CampaignsContextProvider } from 'contexts/CampaignsContext'
import { CharactersContextProvider } from 'contexts/CharactersContext'
import { ModalsContextProvider } from 'contexts/ModalsContext'
import { NotificationsContextProvider } from 'contexts/NotificationsContext'
import { Notifications } from 'components/Notifications'
import { reportWebVitals } from 'helpers/reportWebVitals'
import { useFontawesome } from 'hooks/useFontawesome'





export default function App(props) {
	const {
		Component,
		pageProps,
	} = props

	useFontawesome()

	return (
		<AuthContextProvider>
			<NotificationsContextProvider>
				<CharactersContextProvider>
					<CampaignsContextProvider>
						<ModalsContextProvider>
							<div
								className="container"
								id="application-wrapper">
								<Banner />
								<Component {...pageProps} />
							</div>

							<div id="modal-container" />

							<Notifications />
						</ModalsContextProvider>
					</CampaignsContextProvider>
				</CharactersContextProvider>
			</NotificationsContextProvider>
		</AuthContextProvider>
	)
}

export { reportWebVitals }
