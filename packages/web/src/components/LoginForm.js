// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useModals } from 'contexts/ModalsContext'





function LoginForm(props) {
	const { isModal } = props
	const { closeModal } = useModals()
	const {
		isLoggedIn,
		isLoggingIn,
		login,
	} = useAuth()

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
			}}
			onSubmit={handleSubmit}>
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
	isModal: false,
}

LoginForm.propTypes = {
	isModal: PropTypes.bool,
}

export { LoginForm }
