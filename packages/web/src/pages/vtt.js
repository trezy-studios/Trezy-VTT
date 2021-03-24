// Module imports
import { VTT } from 'vtt'





// Local imports
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function VTTPage() {
	useRedirectOnLoggedOut()

	return (
		<VTT />
	)
}
