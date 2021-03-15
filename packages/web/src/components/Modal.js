// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Button'
import { useModals } from 'contexts/ModalsContext'





function Modal(props) {
	const {
		children,
		name,
		title,
	} = props
	const { closeModal } = useModals()

	const close = useCallback(() => closeModal(name), [
		closeModal,
		name,
	])

	useEffect(() => {
		const handleEscape = event => {
			if (event.code?.toLowerCase() === 'escape') {
				close()
			}
		}

		document.addEventListener('keyup', handleEscape)

		return () => document.removeEventListener('keyup', handleEscape)
	}, [close])

	return createPortal((
		<div className="is-active modal">
			<div className="modal-background" />

			<div className="modal-card">
				<header className="modal-card-head">
					<p className="modal-card-title">{title}</p>

					<button
						aria-label="close"
						className="delete"
						onClick={close} />
				</header>

				<section className="modal-card-body">
					{children}
				</section>
			</div>
		</div>
	), document.querySelector('#modal-container'))
}

Modal.propTypes = {
	children: PropTypes.node.isRequired,
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
}

export { Modal }
