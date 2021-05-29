// Module imports
import {
	useCallback,
} from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'


// Local imports
import { Field } from 'components/Field'
import { FieldControl } from 'components/FieldControl'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'


function InviteForm(props) {
	const {
		showModal,
	} = props
	const { user } = useAuth()
	const Router = useRouter()

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				console.log("to do: send invite to email");
				showModal(false)
			} catch(error) {
				alert(`Unexpected error saving reward: ` + error)
			}
		}
	}, [])

	return (
		<Form
			onSubmit={handleSubmit}
            initialValues={{
                email: '',
            }}>
			<Field
				id="email"
				isRequired
				label="Email">
				<FieldControl
					id="email"
                    iconLeft="envelope"
					isRequired
					type="email" />
			</Field>
			<menu type="toolbar">
				<div className="menu-right">
					<FormButton
						className="is-primary"
						type="submit">
						Invite
					</FormButton>
				</div>
			</menu>
		</Form>
	)
}

InviteForm.defaultProps = {
	isModal: false,
}

InviteForm.propTypes = {
	isModal: PropTypes.bool
}

export { InviteForm }
