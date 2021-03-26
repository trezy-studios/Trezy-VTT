// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useForm } from 'components/Form'





function FieldRadioGroup(props) {
	const {
		className,
		id,
		isDisabled,
		isRequired,
		options,
	} = props
	const {
		errors: formErrors,
		updateValidity,
		updateValue,
		values,
	} = useForm()

	const validate = useCallback(async (state, initialProps) => {
		const errors = []

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
	}, [updateValidity])

	const handleChange = useCallback(event => {
		let value = event.target.value

		updateValue(id, value)
		validate(value, props)
	}, [
		id,
		props,
		updateValue,
		validate,
	])

	const mapOption = useCallback(([optionValue, details]) => {
		const {
			component,
			description,
			label,
		} = details

		const optionID = `${id}::${optionValue}`

		return (
			<li
				className={classnames('radio-option', className)}
				key={optionID}>
				<label className="columns is-gapless">
					<div className="column is-narrow">
						<input
							checked={optionValue === values[id]}
							className="radio"
							disabled={isDisabled}
							id={optionID}
							name={id}
							onChange={handleChange}
							type="radio"
							value={optionValue} />
					</div>
					<div className="column">
						<div className="content">
							<strong>{label}</strong><br />
							{Boolean(description) && (
								<p>{description}</p>
							)}
						</div>
					</div>
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
			className={classnames(className, 'control')}>
			<ul className="radio-group">
				{Object.entries(options).map(mapOption)}
			</ul>
		</div>
	)
}

FieldRadioGroup.defaultProps = {
	className: null,
	isDisabled: false,
	isRequired: false,
	options: {},
	validate: () => {},
}

FieldRadioGroup.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	options: PropTypes.object,
	validate: PropTypes.func,
}

export { FieldRadioGroup }
