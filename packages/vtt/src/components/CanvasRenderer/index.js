// Module imports
import { useRef } from 'react'

// Local imports
import { useRenderer } from 'hooks/useRenderer'

export function CanvasRenderer() {
	const canvasRef = useRef(null)

	useRenderer(canvasRef, [canvasRef.current])

	return (
		<canvas ref={canvasRef} />
	)
}
