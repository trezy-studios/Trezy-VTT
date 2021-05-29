// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'





// Local imports
import { Field } from 'components/Field'
import { FieldControl } from 'components/FieldControl'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useCharacters } from 'contexts/CharactersContext'
import { useModals } from 'contexts/ModalsContext'
import { FieldHidden } from './FieldHidden'





function CharacterForm(props) {
	const { isModal } = props
	const { closeModal } = useModals()
	const { createCharacter } = useCharacters()
	const { user } = useAuth()
	const Router = useRouter()

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				const newCharacterID = await createCharacter({ ...values })
				closeModal('character')
				Router.push(`/characters/${newCharacterID}`)
			} catch(error) {
				alert(`Unexpected error saving character: ` + error)
			}
		}
	}, [createCharacter])

	return (
		<Form
			initialValues={{
				gameID: 'dnd5e',
				name: '',
			}}
			onSubmit={handleSubmit}>
			<Field
				id="name"
				isRequired
				label="Name">
				<FieldControl
					id="name"
					isRequired
					maxLength={100} />
			</Field>

			<FieldHidden
				id="gameID"
				value="dnd5e" />

			<menu type="toolbar">
				<div className="menu-right">
					<FormButton
						className="is-primary"
						type="submit">
						Create Character
					</FormButton>
				</div>
			</menu>
		</Form>
	)
}

CharacterForm.defaultProps = {
	isModal: false,
}

CharacterForm.propTypes = {
	isModal: PropTypes.bool,
}

export { CharacterForm }
