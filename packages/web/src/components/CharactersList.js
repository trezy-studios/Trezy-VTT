// Module imports
import Link from 'next/link'





// Local imports
import { CharacterSummary } from 'components/CharacterSummary'
import { useCharacters } from 'contexts/CharactersContext'





function mapCharacterItem([id, character]) {
	return (
		<li
			className="column is-full-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
			key={id}>
			<CharacterSummary
				id={id}
				character={character} />
		</li>
	)
}

export function CharactersList() {
	const {
		characters,
		isLoaded: isCharactersLoaded,
	} = useCharacters()

	if (!isCharactersLoaded) {
		return (
			<div className="box has-text-centered has-text-grey">
				<progress className="progress is-small is-primary" />
				{'Loading...'}
			</div>
		)
	}

	if (isCharactersLoaded && !characters) {
		return (
			<div className="box has-text-centered has-text-grey">
				{'You haven\'t created any characters... yet.'}
			</div>
		)
	}

	return (
		<ul className="columns is-multiline">
			{Object.entries(characters).map(mapCharacterItem)}
		</ul>
	)
}
