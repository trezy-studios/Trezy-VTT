// Module imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useCallback } from 'react'
import PropTypes from 'prop-types'





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
	const { characterSheet } = props.character

	const mapSkill = useCallback(([skill, skillDisplayName]) => {
		return (
			<tr key={skill}>
				<th>{skillDisplayName}</th>
				<td className="has-text-right">
					{characterSheet[skill]}
				</td>
			</tr>
		)
	}, [characterSheet])

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
					{Object.entries(SKILLS).map(mapSkill)}
				</tbody>
			</table>
		</details>
	)
}

CharacterSkills.propTypes ={
	character: PropTypes.object.isRequired,
}

export { CharacterSkills }
