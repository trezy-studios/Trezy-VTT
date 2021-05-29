// Module imports
import classnames from 'classnames'
import Link from 'next/link'
import PropTypes from 'prop-types'





function MenuLink(props) {
	const {
		children,
		href,
		isActive,
	} = props

	return (
		<li>
			<Link
				href={href}
				shallow>
				<a className={classnames({ 'is-active': isActive })}>
					{children}
				</a>
			</Link>
		</li>
	)
}

MenuLink.propTypes = {
	children: PropTypes.node.isRequired,
	href: PropTypes.string.isRequired,
	isActive: PropTypes.bool.isRequired,
}

export { MenuLink }
