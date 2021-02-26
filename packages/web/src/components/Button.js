// Module imports
import PropTypes from 'prop-types'

function Button(props) {
	const {
		children,
		isDisabled,
		onClick,
		type,
	} = props

	return (
		<button
			disabled={isDisabled}
			onClick={onClick}
			type={type}>
			{children}
		</button>
	)
}

Button.defaultProps = {
	isDisabled: false,
	onClick: undefined,
	type: 'button',
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	isDisabled: PropTypes.bool,
	onClick: PropTypes.func,
	type: PropTypes.string.isRequired,
}

export { Button }
