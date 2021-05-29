// Module imports
import PropTypes from 'prop-types'





function MenuSection(props) {
	const {
		children,
		label,
	} = props

	return (
		<>
			<p className="menu-label">{label}</p>
			<ul className="menu-list">
				{children}
			</ul>
		</>
	)
}

MenuSection.propTypes = {
	children: PropTypes.node.isRequired,
	label: PropTypes.string.isRequired,
}

export { MenuSection }
