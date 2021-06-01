// Module imports
import {
	Children,
	cloneElement,
} from 'react'
import { PropTypes } from 'prop-types'





// Local imports
import { Modal } from 'components/Modal'





function FormModal(props) {
	const {
		children,
		name,
		onClose,
		title,
	} = props

	return (
		<Modal
			name={name}
			title={title}>
			{/*
				* It's weird, I know. This allows us to handle passing the appropriate
				* props onto the child in the `FormModal` component, which saves us the
				* work of doing the same in every derivative of the <Modal /> component.
				* Trust me, it's worth the weird.
				*/}
			{Children.map(children, child => {
				return cloneElement(child, {
					isModal: true,
					onSuccess: onClose,
				})
			})}
		</Modal>
	)
}

FormModal.defaultProps = {
	onClose: () => {},
}

FormModal.propTypes = {
	children: PropTypes.node,
	onClose: PropTypes.func,
}

export { FormModal }
