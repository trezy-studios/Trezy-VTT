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
		<section className="section">
			<div className="columns">
				<div className="column is-half is-offset-one-quarter">
					<Form
						className="box"
						initialValues={{
							email: '',
							password: '',
						}}
						onSubmit={handleSubmit}>
						<h2 className="title">Login</h2>

						<Field
							autocomplete="email"
							iconLeft="envelope"
							id="email"
							isRequired
							label="Email"
							type="email" />

						<Field
							autocomplete="current-password"
							iconLeft="lock"
							id="password"
							isRequired
							label="Password"
							type="password" />

						<FormButton
							className="is-primary"
							isDisabled={isLoggingIn}
							type="submit">
							Login
						</FormButton>
					</Form>
				</div>
			</div>
		</section>
	)
}
