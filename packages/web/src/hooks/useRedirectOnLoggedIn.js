// Module imports
import { useRouter } from 'next/router'
import {
	useEffect,
	useState,
} from 'react'





// Local imports
import { useAuth } from 'contexts/AuthContext'





export function useRedirectOnLoggedIn(destination = '/dashboard') {
	const Router = useRouter()
	const {
		isLoaded,
		user,
	} = useAuth()
	const [isRedirecting, setIsRedirecting] = useState(false)

	useEffect(() => {
		if (isLoaded && user && !isRedirecting) {
			setIsRedirecting(true)
			Router.push(destination)
		}
	}, [
		isLoaded,
		isRedirecting,
		setIsRedirecting,
		user,
	])
}
