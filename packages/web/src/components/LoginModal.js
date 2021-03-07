// Local imports
import { LoginForm } from 'components/LoginForm'
import { Modal } from 'components/Modal'





export function LoginModal() {
	return (
		<Modal
			name="login"
			title="Login">
			<LoginForm isModal />
		</Modal>
	)
}
