export function scaleCanvas(canvasElement) {
	const { parentNode } = canvasElement

	const dpr = window.devicePixelRatio || 1

	canvasElement.getContext('2d').scale(dpr, dpr)
	canvasElement.height = parentNode.clientHeight
	canvasElement.width = parentNode.clientWidth
}
