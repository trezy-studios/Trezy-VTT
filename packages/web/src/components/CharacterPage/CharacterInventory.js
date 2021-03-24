// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'





// Local imports
import { Button } from 'components/Button'
import { calculateAbilityModifier } from 'helpers/calculateAbilityModifier'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useCharacters } from 'contexts/CharactersContext'





// Constants
// TODO: This should exist as dynamic values in the database
const TEMP_INVENTORY = [
	{
		equippable: true,
		imageURL: '',
		isAttuned: false,
		isEquipped: false,
		name: 'Battleaxe, +3',
		quantity: 1,
		rarity: 3,
		requiresAttunement: false,
		weight: 4,
	},

	{
		equippable: true,
		imageURL: '',
		isAttuned: true,
		isEquipped: true,
		name: 'Spellguard Shield',
		quantity: 1,
		rarity: 3,
		requiresAttunement: true,
		weight: 6,
	},

	{
		equippable: true,
		imageURL: '',
		isAttuned: true,
		isEquipped: true,
		name: 'Cloak of Displacement',
		quantity: 1,
		rarity: 2,
		requiresAttunement: true,
		weight: 0,
	},

	{
		equippable: true,
		imageURL: '',
		isAttuned: false,
		isEquipped: false,
		name: 'Plate +1',
		quantity: 1,
		rarity: 2,
		requiresAttunement: false,
		weight: 65,
	},

	{
		equippable: false,
		imageURL: '',
		isAttuned: false,
		isEquipped: false,
		name: 'Potion of Healing (Greater)',
		quantity: 5,
		rarity: 1,
		requiresAttunement: false,
		weight: 2.5,
	},

	{
		equippable: true,
		imageURL: '',
		isAttuned: true,
		isEquipped: true,
		name: 'Slippers of Spider Climbing',
		quantity: 1,
		rarity: 1,
		requiresAttunement: true,
		weight: 0.5,
	},

	{
		equippable: false,
		imageURL: '',
		isAttuned: false,
		isEquipped: false,
		name: 'Backpack',
		quantity: 1,
		rarity: 0,
		requiresAttunement: false,
		weight: 5,
	},
]





function mapItem(item) {
	return (
		<li className="column is-one-third">
			<div className="card">
				<div className="card-content">
					<div className="media">
						<div className="media-left">
							<figure className="image is-48x48">
								<img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
							</figure>
						</div>
						<div className="media-content">
							<p
								className={classnames({
									title: true,
									'is-5': true,
									'is-uncommon': item.rarity === 1,
									'is-rare': item.rarity === 2,
									'is-very-rare': item.rarity === 3,
									'is-legendary': item.rarity === 4,
								})}>
								{item.name}
							</p>
							<p className="has-text-grey-light is-6 subtitle">
								{`x${item.quantity || 1}`}
							</p>
						</div>
					</div>

					<div className="content">
						<p>{item.weight}{'lb.'}{(item.quantity > 1) && ` (${item.weight * item.quantity} lb.)`}</p>
					</div>
				</div>

				<footer className="card-footer">
					<Button
						className="card-footer-item"
						isStyled={false}>
						{item.isEquipped ? 'Unequip' : 'Equip'}
					</Button>

					<Button
						className="card-footer-item has-text-danger"
						isStyled={false}>
						Remove
					</Button>
				</footer>
			</div>
		</li>
	)
}

function CharacterInventory(props) {
	const { characterID } = props
	const { characters } = useCharacters()
	// const { inventory } = characters[characterID]

	return (
		<ul className="columns is-multiline">
			{TEMP_INVENTORY.map(mapItem)}
		</ul>
	)
}

CharacterInventory.propTypes ={
	character: PropTypes.object.isRequired,
}

export { CharacterInventory }
