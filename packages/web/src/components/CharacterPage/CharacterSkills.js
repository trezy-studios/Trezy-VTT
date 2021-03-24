// Module imports
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Button'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
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





function CharacterSkills(props) {
	const { characterID } = props
	const { characters } = useCharacters()
	const { characterSheet } = characters[characterID]

	const mapSkill = useCallback(([skill, skillDisplayName]) => {
		const hasExpertise = characterSheet.character[`${skill}:expert`]
		const isProficient = characterSheet.character[`${skill}:proficient`]

		return (
			<div
				className="panel-block"
				key={skill}>
				<span className="panel-icon">
					<span className="fa-layers fa-fw">
						<FontAwesomeIcon
							fixedWidth
							icon={['far', 'circle']} />

						{isProficient && (
							<FontAwesomeIcon
								fixedWidth
								icon={`check${hasExpertise ? '-double' : ''}`}
								transform="shrink-6" />
						)}
					</span>
				</span>

				<span>{skillDisplayName}</span>

				<div className="panel-block-right">
					<Button
						className="has-tooltip-arrow has-tooltip-left is-light is-primary is-small"
						data-tooltip={characterSheet.skillScoreCalculationString(skill)}>
						{characterSheet[skill]}
					</Button>
				</div>
			</div>
		)
	}, [characterSheet])

	return (
		<details
			className="panel"
			open>
			<summary className="panel-heading">
				<span>{'Skills'}</span>

				<span className="panel-heading-icon">
					<span className="icon">
						<FontAwesomeIcon
							aria-hidden="true"
							fixedWidth
							icon="angle-down" />
					</span>
				</span>
			</summary>

			{Object.entries(SKILLS).map(mapSkill)}
		</details>
	)
}

CharacterSkills.propTypes = {
	characterID: PropTypes.string.isRequired,
}

export { CharacterSkills }
