// Module imports
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'





// Local imports
import { calculateAbilityModifier } from 'helpers/calculateAbilityModifier'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





function CharacterStats(props) {
	const { stats } = props.character

	return (
		<>
			<h3 className="title">Stats</h3>

			<div className="level">
				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Strength</header>
						<div className="title">{stats.strength}</div>
						<span className="has-text-grey-light subtitle">{calculateAbilityModifier(stats.strength)}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Dexterity</header>
						<div className="title">{stats.dexterity}</div>
						<span className="has-text-grey-light subtitle">{calculateAbilityModifier(stats.dexterity)}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Constitution</header>
						<div className="title">{stats.constitution}</div>
						<span className="has-text-grey-light subtitle">{calculateAbilityModifier(stats.constitution)}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Intelligence</header>
						<div className="title">{stats.intelligence}</div>
						<span className="has-text-grey-light subtitle">{calculateAbilityModifier(stats.intelligence)}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Wisdom</header>
						<div className="title">{stats.wisdom}</div>
						<span className="has-text-grey-light subtitle">{calculateAbilityModifier(stats.wisdom)}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Charisma</header>
						<div className="title">{stats.charisma}</div>
						<span className="has-text-grey-light subtitle">{calculateAbilityModifier(stats.charisma)}</span>
					</div>
				</div>
			</div>
		</>
	)
}

CharacterStats.propTypes ={
	character: PropTypes.object.isRequired,
}

export { CharacterStats }
