// Module imports
import { PropTypes } from 'prop-types'





// Local imports
import { FormModal } from 'components/FormModal'
import { RegistrationForm } from 'components/RegistrationForm'





function RegistrationModal(props) {
	const { onClose } = props

	return (
		<FormModal
			name="registration"
			onClose={onClose}
			title="Sign up">
			<RegistrationForm />
		</FormModal>
	)
}

RegistrationModal.defaultProps = {
	onClose: () => {},
}

RegistrationModal.propTypes = {
	onClose: PropTypes.func,
}

export { RegistrationModal }
