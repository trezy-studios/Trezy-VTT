// Module imports
import {
	useCallback,
	useState,
} from 'react'





// Local imports
import { Button } from 'components/Button'
import { useAuth } from 'contexts/AuthContext'
import { useRedirectOnLoggedIn } from 'hooks/useRedirectOnLoggedIn'





export default function RegisterPage() {
	const {
		isRegistering,
		register,
	} = useAuth()

	useRedirectOnLoggedIn()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [username, setUsername] = useState('')

	const handleEmailChange = useCallback(event => setEmail(event.target.value), [setEmail])
	const handlePasswordChange = useCallback(event => setPassword(event.target.value), [setPassword])
	const handleUsernameChange = useCallback(event => setUsername(event.target.value), [setUsername])
	const handleSubmit = useCallback(event => {
		event.preventDefault()
		register({
			email,
			password,
			username,
		})
	}, [
		email,
		password,
		username,
	])

	return (
		<div>
			<header><h2>Create Account</h2></header>

			<div>isRegistering: {JSON.stringify(isRegistering)}</div>

			<form onSubmit={handleSubmit}>
				<div className="field">
					<label htmlFor="register-username">Username</label>
					<input
						autoComplete="username"
						id="register-username"
						onChange={handleUsernameChange}
						required
						value={username} />
				</div>

				<div className="field">
					<label htmlFor="register-email">Email</label>
					<input
						autoComplete="email"
						id="register-email"
						onChange={handleEmailChange}
						required
						type="email"
						value={email} />
				</div>

				<div className="field">
					<label htmlFor="register-password">Password</label>
					<input
						autoComplete="new-password"
						id="register-password"
						minLength="6"
						onChange={handlePasswordChange}
						required
						type="password"
						value={password} />
				</div>

				<Button
					isDisabled={isRegistering}
					type="submit">
					Create Account
				</Button>
			</form>
		</div>
	)
}
