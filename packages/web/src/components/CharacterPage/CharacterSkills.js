// Module imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useCallback } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { calculateAbilityModifier } from 'helpers/calculateAbilityModifier'
import { JSONPreview } from 'components/JSONPreview'





// Constants
const SKILL_ABILITY = {
	acrobatics: 'dexterity',
	animalHandling: 'wisdom',
	arcana: 'intelligence',
	athletics: 'strength',
	deception: 'charisma',
	history: 'intelligence',
	insight: 'wisdom',
	intimidation: 'charisma',
	investigation: 'intelligence',
	medicine: 'wisdom',
	nature: 'intelligence',
	perception: 'wisdom',
	performance: 'charisma',
	persuasion: 'charisma',
	religion: 'intelligence',
	sleightOfHand: 'dexterity',
	stealth: 'dexterity',
	survival: 'wisdom',
}
const SKILL_DISPLAY_NAME = {
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
	const {
		proficiencyBonus,
		skills,
		stats,
	} = props.character

	function calculateSkillValue(skill, details, proficiencyBonus) {
		let value = calculateAbilityModifier(stats[SKILL_ABILITY[skill]])

		if (details.proficient) {
			value += proficiencyBonus
		}

		if (details.expert) {
			value *= 2
		}

		return value
	}

	const mapSkill = useCallback(([skill, details]) => {
		let skillScore = calculateAbilityModifier(stats[SKILL_ABILITY[skill]])

		if (details.proficient) {
			skillScore += proficiencyBonus
		}

		if (details.expert) {
			skillScore *= 2
		}

		return (
			<tr>
				<th>{SKILL_DISPLAY_NAME[skill]}</th>
				<td className="has-text-right">
					{skillScore}
				</td>
			</tr>
		)
	}, [
		stats,
		proficiencyBonus,
	])

	return (
		<details
			className="card"
			open>
			<summary className="card-header">
				<p className="card-header-title">{'Skills'}</p>
				<span className="card-header-icon">
					<span className="icon">
						<FontAwesomeIcon
							aria-hidden="true"
							fixedWidth
							icon="angle-down" />
					</span>
				</span>
			</summary>

			<table className="card-content is-fullwidth is-hoverable is-striped table">
				<tbody>
					{Object.entries(skills).map(mapSkill)}
				</tbody>
			</table>
		</details>
	)
}

CharacterSkills.propTypes ={
	character: PropTypes.object.isRequired,
}

export { CharacterSkills }
