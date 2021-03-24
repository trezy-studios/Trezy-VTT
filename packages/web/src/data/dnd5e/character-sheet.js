// Constants
export const DEFAULT_BUILD = {
	experience: 0,

	charisma: 8,
	constitution: 8,
	dexterity: 8,
	intelligence: 8,
	strength: 8,
	wisdom: 8,

	'acrobatics:expert': false,
	'acrobatics:proficient': false,
	'animalHandling:expert': false,
	'animalHandling:proficient': false,
	'arcana:expert': false,
	'arcana:proficient': false,
	'athletics:expert': false,
	'athletics:proficient': false,
	'deception:expert': false,
	'deception:proficient': false,
	'history:expert': false,
	'history:proficient': false,
	'insight:expert': false,
	'insight:proficient': false,
	'intimidation:expert': false,
	'intimidation:proficient': false,
	'investigation:expert': false,
	'investigation:proficient': false,
	'medicine:expert': false,
	'medicine:proficient': false,
	'nature:expert': false,
	'nature:proficient': false,
	'perception:expert': false,
	'perception:proficient': false,
	'performance:expert': false,
	'performance:proficient': false,
	'persuasion:expert': false,
	'persuasion:proficient': false,
	'religion:expert': false,
	'religion:proficient': false,
	'sleightOfHand:expert': false,
	'sleightOfHand:proficient': false,
	'stealth:expert': false,
	'stealth:proficient': false,
	'survival:expert': false,
	'survival:proficient': false,
}

const DEFAULTS = {
	// CORE STATS
	// These should always be used to determine a character's core abilities.
	core: {
		charisma: {
			base: 8,
			max: 20,
			min: 1
		},

		constitution: {
			base: 8,
			max: 20,
			min: 1
		},

		dexterity: {
			base: 8,
			max: 20,
			min: 1
		},

		intelligence: {
			base: 8,
			max: 20,
			min: 1
		},

		strength: {
			base: 8,
			max: 20,
			min: 1
		},

		wisdom: {
			base: 8,
			max: 20,
			min: 1
		}
	},

	// FLAGS
	// These represent things that have a binary state. For example, a character
	// is either proficient in a skill, or their not. The value of a flag here
	// represents its default value.
	flags: {
		'acrobatics:expert': false,
		'acrobatics:proficient': false,

		'animalHandling:expert': false,
		'animalHandling:proficient': false,

		'arcana:expert': false,
		'arcana:proficient': false,

		'athletics:expert': false,
		'athletics:proficient': false,

		'deception:expert': false,
		'deception:proficient': false,

		'history:expert': false,
		'history:proficient': false,

		'insight:expert': false,
		'insight:proficient': false,

		'intimidation:expert': false,
		'intimidation:proficient': false,

		'investigation:expert': false,
		'investigation:proficient': false,

		'medicine:expert': false,
		'medicine:proficient': false,

		'nature:expert': false,
		'nature:proficient': false,

		'perception:expert': false,
		'perception:proficient': false,

		'performance:expert': false,
		'performance:proficient': false,

		'persuasion:expert': false,
		'persuasion:proficient': false,

		'religion:expert': false,
		'religion:proficient': false,

		'sleightOfHand:expert': false,
		'sleightOfHand:proficient': false,

		'stealth:expert': false,
		'stealth:proficient': false,

		'survival:expert': false,
		'survival:proficient': false
	},

	// RANGES
	// These arrays represent any set of data that can be derived from a list.
	ranges: {
		experienceToLevel: [
			0,
			300,
			900,
			2700,
			6500,
			14000,
			23000,
			34000,
			48000,
			64000,
			85000,
			100000,
			120000,
			140000,
			165000,
			195000,
			225000,
			265000,
			305000,
			355000
		]
	}
}





export class CharacterSheet {
	static skillBaseStats = {
		acrobatics: 'dexterity',
		animalHandling: 'wisdom',
		arcana: 'intelligence',
		athletics: 'strength',
		deception: 'charisma',
		history: 'intelligence',
		insight: 'wisdom',
		intimidation: 'charisma',
		investigation: 'intelligence',
		medicine: 'wisdom',
		nature: 'intelligence',
		perception: 'wisdom',
		performance: 'charisma',
		persuasion: 'charisma',
		religion: 'intelligence',
		sleightOfHand: 'dexterity',
		stealth: 'dexterity',
		survival: 'wisdom',
	}

	calculateAbilityModifier(abilityName) {
		const abilityScore = this[abilityName]
		return Math.floor((abilityScore - 10) / 2)
	}

	calculateSkillScore(skillName) {
		const baseStat = CharacterSheet.skillBaseStats[skillName]
		const hasExpertise = this.character[`${skillName}:expert`]
		const isProficient = this.character[`${skillName}:proficient`]

		let score = this[`${baseStat}Modifier`]

		if (isProficient) {
			score += this.proficiencyBonus

			if (hasExpertise) {
				score += this.proficiencyBonus
			}
		}

		return score
	}

	skillScoreCalculationString(skillName) {
		const baseStat = CharacterSheet.skillBaseStats[skillName]
		const hasExpertise = this.character[`${skillName}:expert`]
		const isProficient = this.character[`${skillName}:proficient`]

		const baseStatScore = this[`${baseStat}Modifier`]
		const baseStatAbbreviation = baseStat.slice(0, 3)

		let skillScoreCalculationString = `${baseStatScore} (${baseStat})`

		if (isProficient) {
			skillScoreCalculationString += ` + ${this.proficiencyBonus} (proficiency bonus)`

			if (hasExpertise) {
				skillScoreCalculationString += ` ⨉ 2 (expertise)`
			}
		}

		return skillScoreCalculationString
	}

	constructor(character) {
		this.character = character
	}

	get experience() {
		return this.character.experience
	}

	// CORE STATS
	get coreStats() {
		return {
			charisma: this.charisma,
			constitution: this.constitution,
			dexterity: this.dexterity,
			intelligence: this.intelligence,
			wisdom: this.wisdom,
			strength: this.strength,
		}
	}

	get charisma() { return this.character.charisma }
	get constitution() { return this.character.constitution }
	get dexterity() { return this.character.dexterity }
	get intelligence() { return this.character.intelligence }
	get wisdom() { return this.character.wisdom }
	get strength() { return this.character.strength }

	get charismaModifier() { return this.calculateAbilityModifier('charisma') }
	get constitutionModifier() { return this.calculateAbilityModifier('constitution') }
	get dexterityModifier() { return this.calculateAbilityModifier('dexterity') }
	get intelligenceModifier() { return this.calculateAbilityModifier('intelligence') }
	get wisdomModifier() { return this.calculateAbilityModifier('wisdom') }
	get strengthModifier() { return this.calculateAbilityModifier('strength') }

	get level() {
		// Each item within the experienceToLevel range represents the experience
		// required to reach a level, and the item itself represents the amount of
		// experience required for that level. To determine the character's level,
		// we'll loop through this list until we find an amount of experience that
		// is less or equal to the amount of experience that the character currently
		// has. We then need to add 1, since arrays are zero-indexed.
		const levelIndex = DEFAULTS.ranges.experienceToLevel.findIndex(xp => this.experience <= xp)
		return levelIndex + 1
	}

	get proficiencyBonus () {
		return Math.ceil(this.level / 4) + 1
	}

	// SKILLS
	get acrobatics() { return this.calculateSkillScore('acrobatics') }
	get animalHandling() { return this.calculateSkillScore('animalHandling') }
	get arcana() { return this.calculateSkillScore('arcana') }
	get athletics() { return this.calculateSkillScore('athletics') }
	get deception() { return this.calculateSkillScore('deception') }
	get history() { return this.calculateSkillScore('history') }
	get insight() { return this.calculateSkillScore('insight') }
	get intimidation() { return this.calculateSkillScore('intimidation') }
	get investigation() { return this.calculateSkillScore('investigation') }
	get medicine() { return this.calculateSkillScore('medicine') }
	get nature() { return this.calculateSkillScore('nature') }
	get perception() { return this.calculateSkillScore('perception') }
	get performance() { return this.calculateSkillScore('performance') }
	get persuasion() { return this.calculateSkillScore('persuasion') }
	get religion() { return this.calculateSkillScore('religion') }
	get sleightOfHand() { return this.calculateSkillScore('sleightOfHand') }
	get stealth() { return this.calculateSkillScore('stealth') }
	get survival() { return this.calculateSkillScore('survival') }
}
