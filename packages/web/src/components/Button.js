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

	const dataAttributes = Object.entries(props).reduce((accumulator, [key, value]) => {
		if (key.startsWith('data-')) {
			accumulator[key] = value
		}
		return accumulator
	}, {})

	return (
		<button
			{...dataAttributes}
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
