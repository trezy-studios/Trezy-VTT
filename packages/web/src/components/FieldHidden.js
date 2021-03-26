// Module imports
import { useEffect } from 'react'
import PropTypes from 'prop-types'





// Local imports
import { useForm } from 'components/Form'





function FieldHidden(props) {
	const { id } = props
	const {
		updateValidity,
		values,
	} = useForm()

	useEffect(() => updateValidity(id, []), [])

	return (
		<input
			type="hidden"
			value={values[id]} />
	)
}

FieldHidden.propTypes = {
	id: PropTypes.string.isRequired,
}

export { FieldHidden }
