// Local imports
import { InviteForm } from 'components/InviteForm'
import { Modal } from 'components/Modal'


export function InviteModal(props) {
	const {
		showModal,
	} = props

	return (
		<Modal
			name="reward"
			title="Send Invitation"
			showModal={showModal}>
			<InviteForm
				showModal={showModal}/>
		</Modal>
	)
}
