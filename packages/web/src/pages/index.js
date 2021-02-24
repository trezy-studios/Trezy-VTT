// Local imports
import { Button } from 'components/Button'
import { useAuth } from 'contexts/AuthContext'

export default function HomePage() {
	const {
		isLoggedIn,
		isLoggingIn,
		login,
		logout,
	} = useAuth()

	return (
		<div>
			<p>Logged in: {isLoggedIn ? 'Yep' : 'Nope'}</p>

			{isLoggedIn && (
				<Button
					isDisabled={isLoggingOut}
					onClick={logout}>
					Logout
				</Button>
			)}

			{!isLoggedIn && (
				<Button
					isDisabled={isLoggingIn}
					onClick={login}>
					Login
				</Button>
			)}
		</div>
	)
}
