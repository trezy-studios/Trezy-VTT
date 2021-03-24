// Module imports
import { useRouter } from 'next/router'
import classnames from 'classnames'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'





// Local imports
import { Button } from 'components/Button'
import { CharacterEdit } from 'components/CharacterPage/CharacterEdit'
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
									<CharacterSkills characterID={characterID} />
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

									<li
										className={classnames({
											'is-active': activeTab === 'edit',
										})}>
										<Link
											href={`/characters/${characterID}/edit`}
											shallow>
											<a>Edit</a>
										</Link>
									</li>
								</ul>
							</div>

							{(activeTab === 'stats') && (
								<CharacterStats characterID={characterID} />
							)}

							{(activeTab === 'inventory') && (
								<CharacterInventory characterID={characterID} />
							)}

							{(activeTab === 'edit') && (
								<CharacterEdit characterID={characterID} />
							)}
						</div>
					</div>
				</>
			)}
		</section>
	)
}
