// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'





// Local imports
import { Button } from 'components/Button'
import { useAuth } from 'contexts/AuthContext'
import { useRedirectOnLoggedIn } from 'hooks/useRedirectOnLoggedIn'





export default function RegisterPage() {
	const {
		isRegistering,
		register,
		validateEmail,
		validateUsername,
	} = useAuth()

	useRedirectOnLoggedIn()

	const [email, setEmail] = useState('')
	const [emailIsValid, setEmailIsValid] = useState(false)
	const [password, setPassword] = useState('')
	const [username, setUsername] = useState('')
	const [usernameIsValid, setUsernameIsValid] = useState(false)
	const emailRef = useRef(null)
	const passwordRef = useRef(null)
	const usernameRef = useRef(null)

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

	useEffect(async () => {
		if (emailRef.current.validity.valid) {
			const isValid = await validateEmail(email)
			setEmailIsValid(isValid)
		}
	}, [email])

	useEffect(async () => {
		if (usernameRef.current.validity.valid) {
			const isValid = await validateUsername(username)
			setUsernameIsValid(isValid)
		}
	}, [username])

	return (
		<div>
			<header><h2>Create Account</h2></header>

			<div>isRegistering: {JSON.stringify(isRegistering)}</div>

			<form onSubmit={handleSubmit}>
				<div
					className={classnames({
						field: true,
						invalid: !usernameIsValid,
					})}>
					<label htmlFor="register-username">Username</label>
					<input
						autoComplete="username"
						id="register-username"
						onChange={handleUsernameChange}
						ref={usernameRef}
						required
						value={username} />
				</div>

				<div
					className={classnames({
						field: true,
						invalid: !emailIsValid,
					})}>
					<label htmlFor="register-email">Email</label>
					<input
						autoComplete="email"
						id="register-email"
						onChange={handleEmailChange}
						ref={emailRef}
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
						ref={passwordRef}
						required
						type="password"
						value={password} />
				</div>

				<Button
					isDisabled={isRegistering || !emailIsValid || !usernameIsValid}
					type="submit">
					Create Account
				</Button>
			</form>
		</div>
	)
}
