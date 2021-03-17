// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





function Button(props) {
	const {
		children,
		className,
		isDisabled,
		isStyled,
		onClick,
		type,
	} = props

	return (
		<button
			className={classnames({
				button: isStyled,
				[className]: true,
			})}
			disabled={isDisabled}
			onClick={onClick}
			type={type}>
			{children}
		</button>
	)
}

Button.defaultProps = {
	className: '',
	isDisabled: false,
	isStyled: true,
	onClick: undefined,
	type: 'button',
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	isDisabled: PropTypes.bool,
	isStyled: PropTypes.bool,
	onClick: PropTypes.func,
	type: PropTypes.string.isRequired,
}

export { Button }
