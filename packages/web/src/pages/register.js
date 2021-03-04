// Module imports
import { useCallback } from 'react'





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
		<section className="section">
			<div className="columns">
				<div className="column is-half is-offset-one-quarter">
					<Form
						className="box"
						initialValues={{
							email: '',
							password: '',
							username: '',
						}}
						onSubmit={handleSubmit}>
						<h2 className="title">Create Account</h2>

						<Field
							autocomplete="username"
							iconLeft="user"
							id="username"
							isRequired
							label="Username"
							shouldDebounceBy={500}
							type="username"
							validate={handleValidateUsername} />

						<Field
							autocomplete="email"
							iconLeft="envelope"
							id="email"
							isRequired
							label="Email"
							shouldDebounceBy={500}
							type="email"
							validate={handleValidateEmail} />

						<Field
							autocomplete="new-password"
							iconLeft="lock"
							id="password"
							isRequired
							label="Password"
							minLength={6}
							type="password" />

						<FormButton
							className="is-primary"
							isDisabled={isRegistering}
							type="submit">
							Create Account
						</FormButton>
					</Form>
				</div>
			</div>
		</section>
	)
}
