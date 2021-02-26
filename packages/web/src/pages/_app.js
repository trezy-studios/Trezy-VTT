// Style imports
import 'scss/reset.scss'
import 'scss/app.scss'





// Local imports
import { AuthContextProvider } from 'contexts/AuthContext'
import { reportWebVitals } from 'helpers/reportWebVitals'





export default function App(props) {
	const {
		Component,
		isServer,
		pageProps,
		store,
	} = props

	return (
		<AuthContextProvider>
			<div id="application-wrapper">
				<Component {...pageProps} />
			</div>
		</AuthContextProvider>
	)
}

export { reportWebVitals }
