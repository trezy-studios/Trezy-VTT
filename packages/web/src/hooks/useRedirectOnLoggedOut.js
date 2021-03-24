// Module imports
import {
	useEffect,
	useState,
} from 'react'
import { useRouter } from 'next/router'





// Local imports
import { useAuth } from 'contexts/AuthContext'





export function useRedirectOnLoggedOut(destination) {
	const Router = useRouter()
	const {
		isLoaded,
		user,
	} = useAuth()
	const [isRedirecting, setIsRedirecting] = useState(false)

	useEffect(() => {
		if (isLoaded && !user && !isRedirecting) {
			setIsRedirecting(true)
			Router.push(`/login${destination ? `?destination=${destination}` : ''}`)
		}
	}, [
		isLoaded,
		isRedirecting,
		setIsRedirecting,
		user,
	])
}
