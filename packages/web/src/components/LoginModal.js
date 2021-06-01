// Module imports
import { PropTypes } from 'prop-types'





// Local imports
import { FormModal } from 'components/FormModal'
import { LoginForm } from 'components/LoginForm'





function LoginModal(props) {
	const { onClose } = props

	return (
		<FormModal
			name="login"
			onClose={onClose}
			title="Login">
			<LoginForm />
		</FormModal>
	)
}

LoginModal.defaultProps = {
	onClose: () => {},
}

LoginModal.propTypes = {
	onClose: PropTypes.func,
}

export { LoginModal }
