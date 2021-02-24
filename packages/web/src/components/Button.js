// Module imports
import PropTypes from 'prop-types'

function Button(props) {
	const {
		children,
		type,
	} = props

	return (
		<button type={type}>
			{children}
		</button>
	)
}

Button.defaultProps = {
	type: 'button',
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	type: PropTypes.string.isRequired,
}

export { Button }
