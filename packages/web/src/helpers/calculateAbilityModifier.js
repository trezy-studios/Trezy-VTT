// TODO: This should be moved into a separate package specifically for D&D5e
export function calculateAbilityModifier(score) {
	return Math.floor((score - 10) / 2)
}
