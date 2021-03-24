// Module imports
import { useRouter } from 'next/router'
import classnames from 'classnames'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'





// Local imports
import { Button } from 'components/Button'
import { CharacterInventory } from 'components/CharacterPage/CharacterInventory'
import { CharacterSkills } from 'components/CharacterPage/CharacterSkills'
import { CharacterStats } from 'components/CharacterPage/CharacterStats'
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useCharacters } from 'contexts/CharactersContext'
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function CharacterDashboardPage() {
	const Router = useRouter()
	const [
		characterID,
		activeTab = 'stats',
	] = (Router.query?.params || [])
	const {
		characters,
		isLoaded: isCharactersLoaded,
	} = useCharacters()

	useRedirectOnLoggedOut()

	let character = null

	if (characters) {
		character = { ...characters[characterID] }
	}

	// TODO: These should exist as dynamic values in the database
	if (character) {
		character.proficiencyBonus = 5

		character.inventory = [
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

		character.stats = {
			charisma: 12,
			constitution: 20,
			dexterity: 13,
			intelligence: 8,
			strength: 20,
			wisdom: 10,
		}

		character.skills = {
			acrobatics: {
				expert: false,
				proficient: false,
			},
			animalHandling: {
				expert: false,
				proficient: true,
			},
			arcana: {
				expert: false,
				proficient: false,
			},
			athletics: {
				expert: false,
				proficient: true,
			},
			deception: {
				expert: false,
				proficient: false,
			},
			history: {
				expert: false,
				proficient: false,
			},
			insight: {
				expert: false,
				proficient: false,
			},
			intimidation: {
				expert: false,
				proficient: true,
			},
			investigation: {
				expert: false,
				proficient: false,
			},
			medicine: {
				expert: false,
				proficient: false,
			},
			nature: {
				expert: false,
				proficient: false,
			},
			perception: {
				expert: false,
				proficient: true,
			},
			performance: {
				expert: false,
				proficient: false,
			},
			persuasion: {
				expert: false,
				proficient: false,
			},
			religion: {
				expert: false,
				proficient: false,
			},
			sleightOfHand: {
				expert: false,
				proficient: false,
			},
			stealth: {
				expert: false,
				proficient: false,
			},
			survival: {
				expert: false,
				proficient: true,
			},
		}
	}

	// TODO: These should be derived from a game object in our database, keyed off the `gameID` field on the character
	const gameTitle = 'Dungeons & Dragons: Fifth Edition'
	const gameURL = 'https://dnd.wizards.com'

	return (
		<section className="section">
			{!isCharactersLoaded && (
				<div>{'Loading...'}</div>
			)}

			{isCharactersLoaded && (
				<>
					<div className="media">
						<div className="media-left">
							<figure className="image is-96x96">
								<img src="/temp/whistle.token.png" alt={`Token for ${character.name}`} />
							</figure>
						</div>

						<div className="media-content">
							<h2 className="title">{character.name}</h2>
							<p className="subtitle">
								{'A '}
								<a href={gameURL}>{gameTitle}</a>
								{' Character'}
							</p>
						</div>
					</div>

					<hr />

					<div className="columns">
						<div className="column is-one-quarter">
							<ul className="card-list">
								<li>
									<CharacterSkills character={character} />
								</li>
							</ul>
						</div>

						<div className="column is-three-quarters">
							<div className="tabs">
								<ul>
									<li
										className={classnames({
											'is-active': activeTab === 'stats',
										})}>
										<Link
											href={`/characters/${characterID}/stats`}
											shallow>
											<a>Stats</a>
										</Link>
									</li>

									<li
										className={classnames({
											'is-active': activeTab === 'inventory',
										})}>
										<Link
											href={`/characters/${characterID}/inventory`}
											shallow>
											<a>Inventory</a>
										</Link>
									</li>

									<li
										className={classnames({
											'is-active': activeTab === 'backstory',
										})}>
										<Link
											href={`/characters/${characterID}/backstory`}
											shallow>
											<a>Backstory</a>
										</Link>
									</li>
								</ul>
							</div>

							{(activeTab === 'stats') && (
								<CharacterStats character={character} />
							)}

							{(activeTab === 'inventory') && (
								<CharacterInventory character={character} />
							)}
						</div>
					</div>
				</>
			)}
		</section>
	)
}
