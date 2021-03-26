// Module imports
import PropTypes from 'prop-types'





function JSONPreview(props) {
	const { children } = props

	try {
		let stringifiedData = JSON.stringify(children, null, 2)

		return (
			<pre>{JSON.stringify(children, null, 2)}</pre>
		)
	} catch (error) {
		console.error(error)

		return (
			<div className="notification is-danger">
				Failed to render item as JSON. Please see console.
			</div>
		)
	}
}

JSONPreview.propTypes = {
	children: PropTypes.any.isRequired,
}

export { JSONPreview }
