// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { FieldControl } from 'components/FieldControl'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useModals } from 'contexts/ModalsContext'





function LoginForm(props) {
	const {
		isModal,
		onSuccess,
	} = props
	const {
		isLoggedIn,
		isLoggingIn,
		login,
	} = useAuth()
	const { closeModal } = useModals()

	const handleSubmit = useCallback(formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			login(values.email, values.password)
		}
	}, [login])

	useEffect(() => {
		if (isModal && isLoggedIn) {
			closeModal('login')
			onSuccess()
		}
	}, [
		closeModal,
		isLoggedIn,
		isModal,
		onSuccess,
	])

	return (
		<Form
			initialValues={{
				email: '',
				password: '',
			}}
			onSubmit={handleSubmit}>
			<Field
				id="email"
				label="Email">
				<FieldControl
					autocomplete="email"
					iconLeft="envelope"
					id="email"
					isDisabled={isLoggingIn}
					isRequired
					type="email" />
			</Field>

			<Field
				id="password"
				label="Password">
				<FieldControl
					autocomplete="current-password"
					iconLeft="lock"
					id="password"
					isDisabled={isLoggingIn}
					isRequired
					type="password" />
			</Field>

			<menu type="toolbar">
				<div className="menu-right">
					<FormButton
						className="is-primary"
						isDisabled={isLoggingIn}
						type="submit">
						Login
					</FormButton>
				</div>
			</menu>
		</Form>
	)
}

LoginForm.defaultProps = {
	onSuccess: () => {},
}

LoginForm.propTypes = {
	onSuccess: PropTypes.func,
}

export { LoginForm }
