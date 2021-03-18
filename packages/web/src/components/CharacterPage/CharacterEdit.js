// Module imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'





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
	const {
		build: character,
		characterSheet,
	} = props.character

	const handleAbilityScoresSubmit = useCallback(() => {
		console.log('handleAbilityScoresSubmit')
	}, [])

	const handleSkillsSubmit = useCallback(() => {
		console.log('handleSkillsSubmit')
	}, [])

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
						label="Proficient"
						type="checkbox"
						value={character[isProficientFlagName]} />

					<Field
						id={hasExpertiseFlagName}
						label="Expert"
						type="checkbox"
						value={character[hasExpertiseFlagName]} />
				</div>
			</div>
		)
	}, [character])

	const reduceSkillsToInitialValues = useCallback((accumulator, skill) => {
		const isProficientFlagName = `${skill}:proficient`
		const hasExpertiseFlagName = `${skill}:expert`

		accumulator[isProficientFlagName] = character[isProficientFlagName]
		accumulator[hasExpertiseFlagName] = character[hasExpertiseFlagName]

		return accumulator
	}, [character])

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
						<FormButton className="is-primary">
							{'Save Ability Scores'}
						</FormButton>
					</div>
				</menu>
			</Form>

			<Form
				initialValues={Object.keys(SKILLS).reduce(reduceSkillsToInitialValues, {})}
				onSubmit={handleSkillsSubmit}>
				<div className="columns is-multiline">
					<div className="column">
						<div className="panel">
							<h3 className="panel-heading">{'Skills'}</h3>

							{Object.entries(SKILLS).map(mapSkill)}

							<menu
								className="panel-block"
								type="toolbar">
								<div className="menu-right">
									<FormButton className="is-primary">
										{'Save Skills'}
									</FormButton>
								</div>
							</menu>
						</div>
					</div>
				</div>
			</Form>
		</>
	)
}

CharacterEdit.propTypes = {
	character: PropTypes.object.isRequired,
}

export { CharacterEdit }
