// Module imports
import tinycolor from 'tinycolor2'





export function getReadableTextColorForBackground(backgroundColor) {
	if (tinycolor.isReadable(backgroundColor, '#4a4a4a')) {
		return '#4a4a4a'
	}

	return '#ffffff'
}
