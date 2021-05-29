// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { FieldControl } from 'components/FieldControl'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useModals } from 'contexts/ModalsContext'





function ReauthenticationForm(props) {
	const { isModal } = props
	const { closeModal } = useModals()
	const {
		isChangingPassword,
		isLoggedIn,
		isLoggingIn,
		isReauthenticating,
		reauthenticate,
	} = useAuth()

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				await reauthenticate(values.password)
			} catch (error) {
				console.log({error})
			}
		}
	}, [reauthenticate])

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
			initialValues={{ password: '' }}
			onSubmit={handleSubmit}>
			<Field
				id="password"
				label={isChangingPassword ? 'Current Password' : 'Password'}>
				<FieldControl
					autocomplete="current-password"
					isDisabled={isReauthenticating}
					iconLeft="lock"
					id="password"
					isRequired
					type="password" />
			</Field>

			<menu type="toolbar">
				<div className="menu-right">
					<FormButton
						className={classnames({
							'is-loading': isReauthenticating,
							'is-primary': true,
						})}
						isDisabled={isReauthenticating}
						type="submit">
						Login
					</FormButton>
				</div>
			</menu>
		</Form>
	)
}

ReauthenticationForm.defaultProps = {
	isModal: false,
}

ReauthenticationForm.propTypes = {
	isModal: PropTypes.bool,
}

export { ReauthenticationForm }
