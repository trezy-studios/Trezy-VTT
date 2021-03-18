// Module imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'





function CharacterEdit(props) {
	const {
		build: character,
		characterSheet,
	} = props.character

	const handleAbilityScoresSubmit = useCallback(() => {
		console.log('handleAbilityScoresSubmit')
	}, [])

	return (
		<>
			<h3 className="title">{'Ability Scores'}</h3>

			<Form
				initialValues={{
					dexterity: characterSheet.dexterity,
					charisma: characterSheet.charisma,
					constitution: characterSheet.constitution,
					intelligence: characterSheet.intelligence,
					strength: characterSheet.strength,
					wisdom: characterSheet.wisdom,
				}}
				onSubmit={handleAbilityScoresSubmit}>
				<div className="columns is-multiline">
					<div className="column is-2">
						<Field
							id="strength"
							isCentered
							isRequired
							label="Strength"
							type="number" />
					</div>

					<div className="column is-2">
						<Field
							id="dexterity"
							isCentered
							isRequired
							label="Dexterity"
							type="number" />
					</div>

					<div className="column is-2">
						<Field
							id="constitution"
							isCentered
							isRequired
							label="Constitution"
							type="number" />
					</div>

					<div className="column is-2">
						<Field
							id="intelligence"
							isCentered
							isRequired
							label="Intelligence"
							type="number" />
					</div>

					<div className="column is-2">
						<Field
							id="wisdom"
							isCentered
							isRequired
							label="Wisdom"
							type="number" />
					</div>

					<div className="column is-2">
						<Field
							id="charisma"
							isCentered
							isRequired
							label="Charisma"
							type="number" />
					</div>
				</div>

				<menu type="toolbar">
					<div className="menu-right">
						<FormButton
							className="is-primary"
							type="submit">
							{'Save Ability Scores'}
						</FormButton>
					</div>
				</menu>
			</Form>
		</>
	)
}

CharacterEdit.propTypes = {
	character: PropTypes.object.isRequired,
}

export { CharacterEdit }
