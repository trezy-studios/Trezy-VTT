// Module imports
import {
	useCallback,
	useEffect,
	useState,
} from 'react'
import debounce from 'lodash/debounce'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useForm } from 'components/Form'





function Field(props) {
	const {
		autocomplete,
		iconLeft,
		id,
		isDisabled,
		isRequired,
		onChange,
		options,
		label,
		maxLength,
		minLength,
		shouldDebounceBy,
		type,
		title,
	} = props
	const {
		errors: formErrors,
		updateValidity,
		updateValue,
		values,
	} = useForm()

	const validate = useCallback(debounce(async (state, initialProps) => {
		const errors = []

		if (
			['number', 'string'].includes(typeof initialProps.maxLength) &&
			(state.length > initialProps.maxLength)
		) {
			errors.push('Too long')
		}

		if (
			['number', 'string'].includes(typeof initialProps.minLength) &&
			(state.length < initialProps.minLength)
		) {
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
		updateValue(id, event.target.value)
		validate(event.target.value, props)
	}, [
		id,
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
				className="radio-option"
				key={optionID}>
				<input
					checked={optionValue === values[id]}
					disabled={isDisabled}
					id={optionID}
					name={id}
					onChange={handleChange}
					required={isRequired}
					type="radio"
					value={optionValue}
					title={title}/>

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
		if (
			(type === 'hidden') |
			(!isRequired && !values[id])
		) {
			updateValidity(id, [])
		}
	}, [])

	if (type === 'hidden') {
		return (
			<input
				type={type}
				value={values[id]} />
		)
	}

	return (
		<div
			className={classnames({
				field: true,
				'radio-group': type === 'radio',
			})}>
			<label
				className="label"
				htmlFor={id}>
				{label}
			</label>

			<div
				className={classnames({
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
						value={values[id]}
						title={title} />
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

			{Boolean(formErrors[id].length) && (
				<ul>
					{formErrors[id].map(error => (
						<li
							className="help is-danger"
							key={error}>
							{error}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

Field.defaultProps = {
	autocomplete: null,
	iconLeft: null,
	isDisabled: false,
	isRequired: false,
	maxLength: null,
	minLength: null,
	onChange: () => {},
	options: {},
	validate: () => {},
	shouldDebounceBy: 0,
	type: 'text',
	title: ''
}

Field.propTypes = {
	autocomplete: PropTypes.string,
	iconLeft: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
	]),
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	label: PropTypes.string.isRequired,
	maxLength: PropTypes.number,
	minLength: PropTypes.number,
	onChange: PropTypes.func,
	options: PropTypes.object,
	shouldDebounceBy: PropTypes.number,
	type: PropTypes.string,
	validate: PropTypes.func,
}

export { Field }
