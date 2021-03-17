// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'





// Local imports
import { Button } from 'components/Button'
import { calculateAbilityModifier } from 'helpers/calculateAbilityModifier'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'





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
	const { inventory } = props.character

	return (
		<>
			<h3 className="title">{'Inventory'}</h3>

			<ul className="columns is-multiline">
				{inventory.map(mapItem)}
			</ul>
		</>
	)
}

CharacterInventory.propTypes ={
	character: PropTypes.object.isRequired,
}

export { CharacterInventory }
