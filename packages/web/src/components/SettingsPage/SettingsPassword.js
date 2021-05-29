// Module imports
import { useCallback } from 'react'





// Local imports
import { Field } from 'components/Field'
import { FieldControl } from 'components/FieldControl'
import { FieldHidden } from 'components/FieldHidden'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { ReauthenticationModal } from 'components/ReauthenticationModal'
import { useAuth } from 'contexts/AuthContext'





export function SettingsPassword() {
	const {
		changePassword,
		isLoggedIn,
		isReauthenticationRequired,
		user,
	} = useAuth()

	const handleSubmit = useCallback(async formState => {
		const { newPassword } = formState.values
		await changePassword(newPassword)
	}, [changePassword])

	const validateConfirmPassword = useCallback((fieldState, formState) => {
		const { newPassword } = formState

		if (fieldState !== newPassword) {
			return 'Passwords don\'t match.'
		}

		return
	})

	if (!isLoggedIn) {
		return (
			<span>Loading...</span>
		)
	}

	return (
		<>
			<h3 className="is-4 title">Change Password</h3>

			<Form
				initialValues={{
					confirmPassword: '',
					newPassword: '',
					email: user.email,
				}}
				onSubmit={handleSubmit}>
				<FieldHidden
					autocomplete="username"
					id="email" />

				<Field
					id="newPassword"
					label="New Password">
					<FieldControl
						autocomplete="new-password"
						id="newPassword"
						type="password" />
				</Field>

				<Field
					id="confirmPassword"
					label="Confirm Password">
					<FieldControl
						autocomplete="new-password"
						id="confirmPassword"
						type="password"
						validate={validateConfirmPassword} />
				</Field>

				<menu type="toolbar">
					<div className="menu-right">
						<FormButton
							className="is-primary"
							type="submit">
							Change Password
						</FormButton>
					</div>
				</menu>
			</Form>

			{isReauthenticationRequired && (
				<ReauthenticationModal />
			)}
		</>
	)
}
