// Module imports
import { useEffect } from 'react'

// Local imports
import { scaleCanvas } from 'helpers/scaleCanvas'

export function useRenderer(canvasRef, dependencies) {
	return useEffect(() => {
		const canvasElement = canvasRef.current

		if (canvasElement) {
			const {
				height,
				width,
			} = canvasElement
			const context = canvasElement.getContext('2d')

			scaleCanvas(canvasElement)

			let frame = 0
			let shouldStop = false

			const loop = () => {
				if (shouldStop) {
					return
				}

				const x = 0
				const y = 0

				context.clearRect(0, 0, width, height)
				context.fillStyle = 'black'
				context.fillRect(x, y, 10, 10)

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
