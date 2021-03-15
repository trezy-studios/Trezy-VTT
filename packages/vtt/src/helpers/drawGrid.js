export function drawGrid(canvasElement) {
	const {
		height,
		width,
	} = canvasElement
	const columnWidth = 20
	const context = canvasElement.getContext('2d')
	const rowHeight = 20

	context.imageSmoothingQuality = 'high'
	context.clearRect(0, 0, width, height)
	context.lineWidth = 1
	context.strokeStyle = 'black'

	// Draw columns
	const columnCount = width / columnWidth

	for (let index = 0; index < columnCount; index += 1) {
		// Since lines are drawn on the line between pixels, the line will actually
		// be using half of 2 pixels. To remedy this, we just offset it by half a
		// pixel.
		const x = index * columnWidth + 0.5

		context.beginPath()
		context.moveTo(x, 0)
		context.lineTo(x, height)
		context.stroke()
	}

	// Draw rows
	const rowCount = width / rowHeight

	for (let index = 0; index < rowCount; index += 1) {
		const y = index * rowHeight + 0.5

		context.beginPath()
		context.moveTo(0, y)
		context.lineTo(width, y)
		context.stroke()
	}

	return canvasElement
}
