// Local imports
import { Modal } from 'components/Modal'
import { RegistrationForm } from 'components/RegistrationForm'





export function RegistrationModal() {
	return (
		<Modal
			name="registration"
			title="Sign up">
			<RegistrationForm isModal />
		</Modal>
	)
}
