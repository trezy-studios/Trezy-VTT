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
			<div>Loading...</div>
		)
	}

	return (
		<ul className="columns is-multiline">
			{Object.entries(characters).map(mapCharacterItem)}
		</ul>
	)
}
