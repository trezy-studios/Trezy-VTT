// Module imports
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





function CharacterStats(props) {
	const { characterSheet } = props.character

	return (
		<>
			<h3 className="title">Stats</h3>

			<div className="level">
				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Strength</header>
						<div className="title">{characterSheet.strength}</div>
						<span className="has-text-grey-light subtitle">{characterSheet.strengthModifier}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Dexterity</header>
						<div className="title">{characterSheet.dexterity}</div>
						<span className="has-text-grey-light subtitle">{characterSheet.dexterityModifier}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Constitution</header>
						<div className="title">{characterSheet.constitution}</div>
						<span className="has-text-grey-light subtitle">{characterSheet.constitutionModifier}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Intelligence</header>
						<div className="title">{characterSheet.intelligence}</div>
						<span className="has-text-grey-light subtitle">{characterSheet.intelligenceModifier}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Wisdom</header>
						<div className="title">{characterSheet.wisdom}</div>
						<span className="has-text-grey-light subtitle">{characterSheet.wisdomModifier}</span>
					</div>
				</div>

				<div className="level-item has-text-centered">
					<div>
						<header className="heading">Charisma</header>
						<div className="title">{characterSheet.charisma}</div>
						<span className="has-text-grey-light subtitle">{characterSheet.charismaModifier}</span>
					</div>
				</div>
			</div>
		</>
	)
}

CharacterStats.propTypes = {
	character: PropTypes.object.isRequired,
}

export { CharacterStats }
