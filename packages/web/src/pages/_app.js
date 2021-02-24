// Style imports
import 'scss/reset.scss'
import 'scss/app.scss'





// Local imports
import { reportWebVitals } from 'helpers/reportWebVitals'





export default function App(props) {
	const {
		Component,
		isServer,
		pageProps,
		store,
	} = props

	return (
		<div id="application-wrapper">
			<Component {...pageProps} />
		</div>
	)
}

export { reportWebVitals }
