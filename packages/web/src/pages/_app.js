// Style imports
import 'scss/lib.scss'
import 'scss/app.scss'





// Local imports
import { AuthContextProvider } from 'contexts/AuthContext'
import { Banner } from 'components/Banner'
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
			<div
				className="container"
				id="application-wrapper">
				<Banner />
				<Component {...pageProps} />
			</div>
		</AuthContextProvider>
	)
}

export { reportWebVitals }
