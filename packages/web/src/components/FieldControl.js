// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import classnames from 'classnames'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useForm } from 'components/Form'





function FieldControl(props) {
	const {
		autocomplete,
		className,
		iconLeft,
		id,
		isCentered,
		isDisabled,
		isRequired,
		options,
		maxLength,
		minLength,
		shouldDebounceBy,
		type,
	} = props
	const {
		errors: formErrors,
		updateValidity,
		updateValue,
		values,
	} = useForm()

	const validate = useCallback(debounce(async (state, initialProps) => {
		const errors = []

		if (initialProps.maxLength && (state.length > initialProps.maxLength)) {
			errors.push('Too long')
		}

		if (initialProps.minLength && (state.length < initialProps.minLength)) {
			errors.push('Too short')
		}

		if (initialProps.isRequired && !state) {
			errors.push('Field is required')
		}

		if (typeof initialProps.validate === 'function') {
			const customError = await initialProps.validate(state)
			if (customError) {
				errors.push(customError)
			}
		}

		updateValidity(id, errors)
	}, shouldDebounceBy), [updateValidity])

	const handleChange = useCallback(event => {
		let value = event.target.value

		if (type === 'number') {
			// If the value contains a decimal, parse as a float. Otherwise, parse as
			// an integer.
			if (value.indexOf('.') !== -1) {
				value = parseFloat(value)
			} else {
				value = parseInt(value)
			}
		}

		updateValue(id, value)
		validate(value, props)
	}, [
		id,
		type,
		updateValue,
		validate,
	])

	const mapOption = useCallback(([optionValue, details]) => {
		const {
			component,
			label: optionLabel,
		} = details

		const optionID = `${id}::${optionValue}`

		return (
			<li
				className={classnames('radio-option', className)}
				key={optionID}>
				<input
					checked={optionValue === values[id]}
					disabled={isDisabled}
					id={optionID}
					name={id}
					onChange={handleChange}
					required={isRequired}
					type="radio"
					value={optionValue} />

				<label htmlFor={optionID}>
					{component || optionLabel}
				</label>
			</li>
		)
	}, [
		handleChange,
		id,
		isDisabled,
	])

	useEffect(() => {
		// Mark hidden and empty, non-required fields as valid
		if (!isRequired && !values[id]) {
			updateValidity(id, [])

		// Run a validity check against a field's initial state if it's non-empty
		} else if (isRequired && (values[id] !== '')) {
			validate(values[id], props)
		}
	}, [])

	return (
		<div
			className={classnames(className, {
				control: true,
				'has-icons-left': iconLeft,
				'has-icons-right': formErrors[id].length,
			})}>
			{(type === 'radio') && (
				<ol className="radio-options">
					{Object.entries(options).map(mapOption)}
				</ol>
			)}

			{(type !== 'radio') && (
				<input
					autoComplete={autocomplete}
					className={classnames({
						'has-text-centered': isCentered,
						input: true,
						'is-danger': formErrors[id].length,
					})}
					disabled={isDisabled}
					id={id}
					maxLength={maxLength}
					minLength={minLength}
					onChange={handleChange}
					required={isRequired}
					type={type}
					value={values[id]} />
			)}

			{Boolean(iconLeft) && (
				<span className="icon is-small is-left">
					<FontAwesomeIcon
						fixedWidth
						icon={iconLeft} />
				</span>
			)}

			{Boolean(formErrors[id].length) && (
				<span className="icon is-small is-right">
					<FontAwesomeIcon
						fixedWidth
						icon="exclamation-triangle" />
				</span>
			)}
		</div>
	)
}

FieldControl.defaultProps = {
	autocomplete: null,
	className: null,
	iconLeft: null,
	isCentered: false,
	isDisabled: false,
	isRequired: false,
	maxLength: null,
	minLength: null,
	options: {},
	shouldDebounceBy: 0,
	type: 'text',
	validate: () => {},
}

FieldControl.propTypes = {
	autocomplete: PropTypes.string,
	className: PropTypes.string,
	iconLeft: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
	]),
	id: PropTypes.string.isRequired,
	isCentered: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	maxLength: PropTypes.number,
	minLength: PropTypes.number,
	options: PropTypes.object,
	shouldDebounceBy: PropTypes.number,
	type: PropTypes.string,
	validate: PropTypes.func,
}

export { FieldControl }
