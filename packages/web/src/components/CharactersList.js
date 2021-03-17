// Local imports
import { JSONPreview } from 'components/JSONPreview'
import { useCharacters } from 'contexts/CharactersContext'





function mapCharacterItem([id, character]) {
	return (
		<li
			className="column is-full-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
			key={id}>
			<JSONPreview>{character}</JSONPreview>
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
