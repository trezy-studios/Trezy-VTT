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
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useCharacters } from 'contexts/CharactersContext'
import { useModals } from 'contexts/ModalsContext'





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
				console.log('creating character', values)
				const newCharacterID = await createCharacter({ ...values })
				console.log('created character', newCharacterID)
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
				label="Name"
				type="text"
				maxLength={100} />

			<Field
				id="gameID"
				label="Game"
				type="hidden"
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
