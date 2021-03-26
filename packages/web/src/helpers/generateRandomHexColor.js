const HEX_DIGITS = '0123456789abcdef'

export function generateRandomHexColor() {
	let colorHex = '#'

	while (colorHex.length < 7) {
		const digitIndex = Math.floor(Math.random() * HEX_DIGITS.length)
		colorHex += HEX_DIGITS[digitIndex]
	}

	return colorHex
}
