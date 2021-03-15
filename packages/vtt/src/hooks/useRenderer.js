// Module imports
import {
	useEffect,
	useRef,
} from 'react'

// Local imports
import { drawGrid } from 'helpers/drawGrid'
import { scaleCanvas } from 'helpers/scaleCanvas'

function createCanvas() {
	if (typeof window === 'undefined') {
		return null
	}

	return document.createElement('canvas')
}

export function useRenderer(canvasRef, dependencies) {
	const gridRef = useRef(createCanvas())

	return useEffect(() => {
		const canvasElement = canvasRef.current
		const gridElement = gridRef.current

		if ((typeof window !== 'undefined') && canvasElement) {
			const context = canvasElement.getContext('2d')

			scaleCanvas(canvasElement, gridElement)

			let frame = 0
			let shouldStop = false

			const loop = () => {
				if (shouldStop) {
					return
				}

				const {
					height,
					width,
				} = canvasElement
				const x = 0
				const y = 0

				drawGrid(gridElement)

				// Clear the canvas
				context.clearRect(0, 0, width, height)
				context.fillStyle = 'black'
				context.fillRect(x, y, 10, 10)

				// Draw the grid
				context.drawImage(
					gridElement,
					0, // source x
					0, // source y
					gridElement.width, // source width
					gridElement.height, // source height
					0, // destination x
					0, // destination y
					width, // destination width
					height, // destination height
				)

				frame += 1
				requestAnimationFrame(loop)
			}

			loop()

			return () => {
				shouldStop = true
			}
		}
	}, dependencies)
}
