// Module imports
import { useCallback } from 'react'
import classnames from 'classnames'





// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useRedirectOnLoggedIn } from 'hooks/useRedirectOnLoggedIn'





export default function LoginPage() {
	const {
		isLoggingIn,
		login,
	} = useAuth()

	useRedirectOnLoggedIn()

	const handleSubmit = useCallback(formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			login(values.email, values.password)
		}
	}, [login])

	return (
		<div>
			<header><h2>Login</h2></header>

			<Form
				initialValues={{
					email: '',
					password: '',
				}}
				onSubmit={handleSubmit}>
				<Field
					autocomplete="email"
					id="email"
					isRequired
					label="Email"
					type="email" />

				<Field
					autocomplete="current-password"
					id="password"
					isRequired
					label="Password"
					type="password" />

				<FormButton
					isDisabled={isLoggingIn}
					type="submit">
					Login
				</FormButton>
			</Form>
		</div>
	)
}
