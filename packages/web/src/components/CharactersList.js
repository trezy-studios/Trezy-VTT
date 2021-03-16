// Local imports
// import { CharacterSummary } from 'components/CharacterSummary'
// import { useCharacters } from 'contexts/CharactersContext'





// function mapCharacterItem([id, campaign]) {
// 	return (
// 		<li
// 			className="column is-full-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd"
// 			key={id}>
// 			<CharacterSummary
// 				id={id}
// 				campaign={campaign} />
// 		</li>
// 	)
// }

export function CharactersList() {
	// const {
	// 	campaigns,
	// 	isLoaded: isCharactersLoaded,
	// } = useCharacters()

	// if (!isCharactersLoaded) {
	// 	return (
	// 		<div>Loading...</div>
	// 	)
	// }

	return (
		<ul className="columns is-multiline">
			{/* {Object.entries(campaigns).map(mapCharacterItem)} */}
		</ul>
	)
}
