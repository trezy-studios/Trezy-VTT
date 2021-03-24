// Module imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
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
	const character = characters[characterID]
	const {
		build: characterBuild,
		characterSheet,
	} = character
	const isSaving = isSavingCharacterSheets[characterID]

	const handleCharacterSubmit = useCallback(formState => {
		const { values } = formState
		console.log(characterID, values)
	}, [characterID])

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
					<Field
						id={isProficientFlagName}
						isDisabled={isSaving}
						label="Proficient"
						type="checkbox"
						value={characterBuild[isProficientFlagName]} />

					<Field
						id={hasExpertiseFlagName}
						isDisabled={isSaving}
						label="Expert"
						type="checkbox"
						value={characterBuild[hasExpertiseFlagName]} />
				</div>
			</div>
		)
	}, [
		characterBuild,
		isSaving,
	])

	const reduceSkillsToInitialValues = useCallback((accumulator, skill) => {
		const isProficientFlagName = `${skill}:proficient`
		const hasExpertiseFlagName = `${skill}:expert`

		accumulator[isProficientFlagName] = characterBuild[isProficientFlagName]
		accumulator[hasExpertiseFlagName] = characterBuild[hasExpertiseFlagName]

		return accumulator
	}, [characterBuild])

	return (
		<div className="columns is-multiline">
			<Form
				className="column is-full"
				initialValues={{
					'character-name': character.name,
				}}
				onSubmit={handleCharacterSubmit}>
				<div className="panel">
					<h3 className="panel-heading">{'Character Details'}</h3>

					<label className="panel-block">
						<span>{'Name'}</span>

						<div className="panel-block-right">
							<Field
								id="character-name"
								isDisabled={isSaving}
								isRequired
								label="Name"
								showLabel={false} />
						</div>
					</label>

					<label className="panel-block">
						<span>Avatar</span>

						<div className="panel-block-right">
							<div className="file has-name is-right">
								<span className="file-label">
									<input className="file-input" type="file" name="resume" />

									<span className="file-cta">
										<span className="file-icon">
											<FontAwesomeIcon
												fixedWidth
												icon="upload" />
										</span>

										<span className="file-label">
											{'Choose a file…'}
										</span>
									</span>

									<span className="file-name">
										Screen Shot 2017-07-29 at 15.54.25.png
									</span>
								</span>
							</div>
						</div>
					</label>

					<menu
						className="panel-block"
						type="toolbar">
						<FormButton
							className="is-fullwidth is-primary"
							isDisabled={isSaving}
							type="submit">
							{'Save Character Details'}
						</FormButton>
					</menu>
				</div>
			</Form>

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
								isCentered
								isDisabled={isSaving}
								isRequired
								label="Strength"
								showLabel={false}
								type="number" />
						</div>
					</label>

					<label className="panel-block">
						<span>{'Dexterity'}</span>

						<div className="panel-block-right">
							<Field
								id="dexterity"
								isCentered
								isDisabled={isSaving}
								isRequired
								label="Dexterity"
								showLabel={false}
								type="number" />
						</div>
					</label>

					<label className="panel-block">
						<span>{'Constitution'}</span>

						<div className="panel-block-right">
							<Field
								id="constitution"
								isCentered
								isDisabled={isSaving}
								isRequired
								label="Constitution"
								showLabel={false}
								type="number" />
						</div>
					</label>

					<label className="panel-block">
						<span>{'Intelligence'}</span>

						<div className="panel-block-right">
							<Field
								id="intelligence"
								isCentered
								isDisabled={isSaving}
								isRequired
								label="Intelligence"
								showLabel={false}
								type="number" />
						</div>
					</label>

					<label className="panel-block">
						<span>{'Wisdom'}</span>

						<div className="panel-block-right">
							<Field
								id="wisdom"
								isCentered
								isDisabled={isSaving}
								isRequired
								label="Wisdom"
								showLabel={false}
								type="number" />
						</div>
					</label>

					<label className="panel-block">
						<span>{'Charisma'}</span>

						<div className="panel-block-right">
							<Field
								id="charisma"
								isCentered
								isDisabled={isSaving}
								isRequired
								label="Charisma"
								showLabel={false}
								type="number" />
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
