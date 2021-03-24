// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useModals } from 'contexts/ModalsContext'





function RegistrationForm(props) {
	const { isModal } = props
	const { closeModal } = useModals()
	const {
		isLoggedIn,
		isRegistering,
		register,
		validateEmail,
		validateUsername,
	} = useAuth()

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

	useEffect(() => {
		if (isModal && isLoggedIn) {
			closeModal('registration')
		}
	}, [
		closeModal,
		isLoggedIn,
		isModal,
	])

	return (
		<Form
			initialValues={{
				email: '',
				password: '',
				username: '',
			}}
			onSubmit={handleSubmit}>
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
	)
}

RegistrationForm.defaultProps = {
	isModal: false,
}

RegistrationForm.propTypes = {
	isModal: PropTypes.bool,
}

export { RegistrationForm }
