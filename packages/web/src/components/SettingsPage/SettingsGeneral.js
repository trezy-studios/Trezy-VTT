// Local imports
import { Field } from 'components/Field'
import { FieldControl } from 'components/FieldControl'
import { Form } from 'components/Form'
import { useAuth } from 'contexts/AuthContext'





export function SettingsGeneral() {
	const {
		isLoggedIn,
		user,
	} = useAuth()

	if (!isLoggedIn) {
		return (
			<span>Loading...</span>
		)
	}

	return (
		<>
			<h3 className="is-4 title">General Settings</h3>

			<Form
				initialValues={{
					email: user.email,
				}}
				onSubmit={() => {}}>
				<Field
					id="email"
					label="Email">
					<FieldControl
						id="email"
						type="email" />
				</Field>

				<Field
					id="username"
					label="Username">
					<FieldControl id="username" />
				</Field>
			</Form>
		</>
	)
}
