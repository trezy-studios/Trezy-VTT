// Local imports
import { CharacterForm } from 'components/CharacterForm'
import { Modal } from 'components/Modal'





export function CharacterModal() {
	return (
		<Modal
			name="character"
			title="Create Character">
			<CharacterForm isModal />
		</Modal>
	)
}
