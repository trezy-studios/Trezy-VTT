// Local imports
import { ReauthenticationForm } from 'components/ReauthenticationForm'
import { Modal } from 'components/Modal'





export function ReauthenticationModal(props) {
	return (
		<Modal
			name="reauthentication"
			title="Confirm Identity">
			<ReauthenticationForm isModal />
		</Modal>
	)
}
