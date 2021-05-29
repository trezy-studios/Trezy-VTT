// Module imports
import PropTypes from 'prop-types'





function Menu(props) {
	const { children } = props

	return (
		<aside className="menu">
			{children}
		</aside>
	)
}

Menu.propTypes = {
	children: PropTypes.node.isRequired,
}

export * from './MenuLink'
export { Menu }
