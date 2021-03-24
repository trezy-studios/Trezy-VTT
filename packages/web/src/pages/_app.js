// Style imports
import 'scss/lib.scss'
import 'scss/app.scss'





// Local imports
import { AuthContextProvider } from 'contexts/AuthContext'
import { Banner } from 'components/Banner'
import { CampaignsContextProvider } from 'contexts/CampaignsContext'
import { CharactersContextProvider } from 'contexts/CharactersContext'
import { ModalsContextProvider } from 'contexts/ModalsContext'
import { reportWebVitals } from 'helpers/reportWebVitals'
import { useFontawesome } from 'hooks/useFontawesome'





export default function App(props) {
	const {
		Component,
		isServer,
		pageProps,
		store,
	} = props

	useFontawesome()

	return (
		<AuthContextProvider>
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
					</ModalsContextProvider>
				</CampaignsContextProvider>
			</CharactersContextProvider>
		</AuthContextProvider>
	)
}

export { reportWebVitals }
