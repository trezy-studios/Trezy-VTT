// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import { ChromePicker } from 'react-color'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useForm } from 'components/Form'





function FieldCheckbox(props) {
	const {
		className,
		id,
		isDisabled,
		isRequired,
		label,
	} = props
	const {
		errors: formErrors,
		updateValidity,
		updateValue,
		values,
	} = useForm()

	const validate = useCallback(async (state, initialProps) => {
		const errors = []

		if (typeof initialProps.validate === 'function') {
			const customError = await initialProps.validate(state)
			if (customError) {
				errors.push(customError)
			}
		}

		updateValidity(id, errors)
	}, [updateValidity])

	const handleChange = useCallback(event => {
		let value = event.target.checked
		updateValue(id, value)
		validate(value, props)
	}, [
		id,
		updateValue,
		validate,
	])

	useEffect(() => updateValidity(id, []), [])

	return (
		<label
			className={classnames('checkbox', className)}
			disabled={isDisabled}>
			<input
				checked={values[id]}
				className="checkbox"
				disabled={isDisabled}
				id={id}
				onChange={handleChange}
				required={isRequired}
				type="checkbox" />
			{label}
		</label>
	)
}

FieldCheckbox.defaultProps = {
	className: null,
	isDisabled: false,
	isRequired: false,
	label: null,
	validate: () => {},
}

FieldCheckbox.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	label: PropTypes.string,
	validate: PropTypes.func,
}

export { FieldCheckbox }
