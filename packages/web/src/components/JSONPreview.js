// Module imports
import PropTypes from 'prop-types'





function JSONPreview(props) {
	const { children } = props

	return (
		<pre>{JSON.stringify(children, null, 2)}</pre>
	)
}

JSONPreview.propTypes = {
	children: PropTypes.string.isRequired,
}

export { JSONPreview }
