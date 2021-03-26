// Module imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { FieldCheckbox } from 'components/FieldCheckbox'
import { FieldControl } from 'components/FieldControl'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useCharacters } from 'contexts/CharactersContext'





// Constants
const SKILLS = {
	acrobatics: 'Acrobatics',
	animalHandling: 'Animal Handling',
	arcana: 'Arcana',
	athletics: 'Athletics',
	deception: 'Deception',
	history: 'History',
	insight: 'Insight',
	intimidation: 'Intimidation',
	investigation: 'Investigation',
	medicine: 'Medicine',
	nature: 'Nature',
	perception: 'Perception',
	performance: 'Performance',
	persuasion: 'Persuasion',
	religion: 'Religion',
	sleightOfHand: 'Sleight Of Hand',
	stealth: 'Stealth',
	survival: 'Survival',
}





function CharacterEdit(props) {
	const { characterID } = props
	const {
		characters,
		isSavingCharacterSheets,
		updateCharacterSheet,
	} = useCharacters()
	const {
		build: character,
		characterSheet,
	} = characters[characterID]
	const isSaving = isSavingCharacterSheets[characterID]

	const handleCharacterSheetSubmit = useCallback(formState => {
		const { values } = formState
		updateCharacterSheet(characterID, values)
	}, [
		characterID,
		updateCharacterSheet,
	])

	const mapSkill = useCallback(([skill, skillDisplayName]) => {
		const hasExpertiseFlagName = `${skill}:expert`
		const isProficientFlagName = `${skill}:proficient`

		return (
			<div
				className="panel-block"
				key={skill}>
				<span>{skillDisplayName}</span>

				<div className="panel-block-right">
					<Field id={isProficientFlagName}>
						<FieldCheckbox
							id={isProficientFlagName}
							isDisabled={isSaving}
							value={character[isProficientFlagName]}
							label="Proficient" />
					</Field>

					<Field id={hasExpertiseFlagName}>
						<FieldCheckbox
							id={hasExpertiseFlagName}
							isDisabled={isSaving}
							value={character[hasExpertiseFlagName]}
							label="Expert" />
					</Field>
				</div>
			</div>
		)
	}, [
		character,
		isSaving,
	])

	const reduceSkillsToInitialValues = useCallback((accumulator, skill) => {
		const isProficientFlagName = `${skill}:proficient`
		const hasExpertiseFlagName = `${skill}:expert`

		accumulator[isProficientFlagName] = character[isProficientFlagName]
		accumulator[hasExpertiseFlagName] = character[hasExpertiseFlagName]

		return accumulator
	}, [character])

	return (
		<div className="columns is-multiline">
			<Form
				className="column is-half"
				initialValues={{
					dexterity: characterSheet.dexterity,
					charisma: characterSheet.charisma,
					constitution: characterSheet.constitution,
					intelligence: characterSheet.intelligence,
					strength: characterSheet.strength,
					wisdom: characterSheet.wisdom,
				}}
				onSubmit={handleCharacterSheetSubmit}>
				<div className="panel">
					<h3 className="panel-heading">{'Ability Scores'}</h3>

					<label className="panel-block">
						<span>{'Strength'}</span>

						<div className="panel-block-right">
							<Field
								id="strength"
								isRequired>
								<FieldControl
									alignment="center"
									id="strength"
									isDisabled={isSaving}
									isRequired
									type="number" />
							</Field>
						</div>
					</label>

					<label className="panel-block">
						<span>{'Dexterity'}</span>

						<div className="panel-block-right">
							<Field
								id="dexterity"
								isRequired>
								<FieldControl
									alignment="center"
									id="dexterity"
									isDisabled={isSaving}
									isRequired
									type="number" />
							</Field>
						</div>
					</label>

					<label className="panel-block">
						<span>{'Constitution'}</span>

						<div className="panel-block-right">
							<Field
								id="constitution"
								isRequired>
								<FieldControl
									alignment="center"
									id="constitution"
									isDisabled={isSaving}
									isRequired
									type="number" />
							</Field>
						</div>
					</label>

					<label className="panel-block">
						<span>{'Intelligence'}</span>

						<div className="panel-block-right">
							<Field
								id="intelligence"
								isRequired>
								<FieldControl
									alignment="center"
									id="intelligence"
									isDisabled={isSaving}
									isRequired
									type="number" />
							</Field>
						</div>
					</label>

					<label className="panel-block">
						<span>{'Wisdom'}</span>

						<div className="panel-block-right">
							<Field
								id="wisdom"
								isRequired>
								<FieldControl
									alignment="center"
									id="wisdom"
									isDisabled={isSaving}
									isRequired
									type="number" />
							</Field>
						</div>
					</label>

					<label className="panel-block">
						<span>{'Charisma'}</span>

						<div className="panel-block-right">
							<Field
								id="charisma"
								isRequired>
								<FieldControl
									alignment="center"
									id="charisma"
									isDisabled={isSaving}
									isRequired
									type="number" />
							</Field>
						</div>
					</label>

					<menu
						className="panel-block"
						type="toolbar">
						<FormButton
							className="is-fullwidth is-primary"
							isDisabled={isSaving}
							type="submit">
							{'Save Ability Scores'}
						</FormButton>
					</menu>
				</div>
			</Form>

			<Form
				className="column is-half"
				initialValues={Object.keys(SKILLS).reduce(reduceSkillsToInitialValues, {})}
				onSubmit={handleCharacterSheetSubmit}>
				<div className="panel">
					<h3 className="panel-heading">{'Skills'}</h3>

					{Object.entries(SKILLS).map(mapSkill)}

					<menu
						className="panel-block"
						type="toolbar">
						<FormButton
							className="is-fullwidth is-primary"
							type="submit">
							{'Save Skills'}
						</FormButton>
					</menu>
				</div>
			</Form>
		</div>
	)
}

CharacterEdit.propTypes = {
	characterID: PropTypes.string.isRequired,
}

export { CharacterEdit }
