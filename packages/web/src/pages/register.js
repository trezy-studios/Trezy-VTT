// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'





// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
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

	const handleSubmit = useCallback(formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			register(values)
		}
	}, [register])

	const handleValidateEmail = useCallback(async value => {
		const isValid = await validateEmail(value)

		if (isValid) {
			return null
		}

		return 'Email is already in use.'
	})

	const handleValidateUsername = useCallback(async value => {
		const isValid = await validateUsername(value)

		if (isValid) {
			return null
		}

		return 'Username is already taken.'
	})

	return (
		<div>
			<header><h2>Create Account</h2></header>

			<Form
				initialValues={{
					email: '',
					password: '',
					username: '',
				}}
				onSubmit={handleSubmit}>
				<Field
					autocomplete="username"
					id="username"
					isRequired
					label="Username"
					shouldDebounceBy={500}
					type="username"
					validate={handleValidateUsername} />

				<Field
					autocomplete="email"
					id="email"
					isRequired
					label="Email"
					shouldDebounceBy={500}
					type="email" />

				<Field
					autocomplete="new-password"
					id="password"
					isRequired
					label="Password"
					minLength={6}
					type="password" />

				<FormButton
					isDisabled={isRegistering}
					type="submit">
					Create Account
				</FormButton>
			</Form>
		</div>
	)
}
