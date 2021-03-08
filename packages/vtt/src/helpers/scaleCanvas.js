export function scaleCanvas(primaryCanvasElement, ...otherCanvasElements) {
	const { parentNode } = primaryCanvasElement

	const allCanvasElements = [primaryCanvasElement, ...otherCanvasElements]
	const dpr = window.devicePixelRatio || 1
	const height = parentNode.clientHeight
	const width = parentNode.clientWidth

	allCanvasElements.forEach(canvasElement => {
		canvasElement.getContext('2d').scale(dpr, dpr)
		canvasElement.height = height
		canvasElement.width = width
	})
}
