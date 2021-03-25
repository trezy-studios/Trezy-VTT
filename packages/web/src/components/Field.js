// Module imports
import {
	Children,
	useCallback,
	useEffect,
	useState,
} from 'react'
import debounce from 'lodash/debounce'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { ChromePicker } from 'react-color'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useForm } from 'components/Form'





function Field(props) {
	const {
		autocomplete,
		children,
		className,
		helperText,
		iconLeft,
		id,
		isDisabled,
		isCentered,
		isRequired,
		label,
		options,
		maxLength,
		minLength,
		shouldDebounceBy,
		showLabel,
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

		if (type !== 'checkbox') {
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

		if (type === 'checkbox') {
			value = event.target.checked
		} else if (type === 'number') {
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
		// Mark hidden and empty, non-required fields as valid
		if (
			['hidden','checkbox'].includes(type) ||
			(!isRequired && !values[id])
		) {
			updateValidity(id, [])

		// Run a validity check against a field's initial state if it's non-empty
		} else if (isRequired && (values[id] !== '')) {
			validate(values[id], props)
		}
	}, [])

	if (type === 'hidden') {
		return (
			<input
				type={type}
				value={values[id]} />
		)
	}

	if (type === 'chromepicker'){
		const [color, setColor] = useState(values[id])
		return (
		<div className="field">
			<label className="label">Color</label>

			<div title={title}>
				<ChromePicker
					color={color}
					onChange={color => {
						setColor(color)
						updateValue(id, color.hex)
						validate(color.hex, props)
					}}/>
			</div>
		</div>
		)
	}

	if (type === "checkbox") {
		if (showLabel) {
			return (
				<label className="checkbox">
					<input
						checked={values[id]}
						className="checkbox"
						disabled={isDisabled}
						id={id}
						onChange={handleChange}
						required={isRequired}
						type={type} />
					{label}
				</label>
			)

			return (
				<div className="field">
					<label className="checkbox">
						<input
							checked={values[id]}
							className="checkbox"
							disabled={isDisabled}
							id={id}
							onChange={handleChange}
							required={isRequired}
							title={title}
							type={type} />
						{label}
					</label>
				</div>
			)
		}
	}

	let renderedHelpers = null
	let renderedLabel = null

	if (!formErrors[id].length && helperText) {
		renderedHelpers = (
			<p className="help">{helperText}</p>
		)
	} else if (Boolean(formErrors[id].length)) {
		renderedHelpers = (
			<ul>
				{formErrors[id].map(error => (
					<li
						className="help is-danger"
						key={error}>
						{error}
					</li>
				))}
			</ul>
		)
	}

	if (showLabel) {
		renderedLabel = (
			<label
				className={classnames({
					label: true,
					'has-text-centered': isCentered,
				})}
				htmlFor={id}>
				{label}
			</label>
		)
	}

	if (Children.count(children) > 1) {
		return (
			<div className={classnames('field', className)}>
				{renderedLabel}

				<div className="field has-addons">
					{children}
				</div>

				{renderedHelpers}
			</div>
		)
	}

	return (
		<div
			className={classnames(className, {
				field: true,
				'has-addons': Children.count(children) > 1,
				'radio-group': type === 'radio',
			})}>
			{renderedLabel}

			{children || (
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
			)}

			{renderedHelpers}
		</div>
	)
}

Field.defaultProps = {
	autocomplete: null,
	children: null,
	className: null,
	helperText: null,
	iconLeft: null,
	isDisabled: false,
	isRequired: false,
	label: null,
	maxLength: null,
	minLength: null,
	options: {},
	validate: () => {},
	shouldDebounceBy: 0,
	showLabel: true,
	type: 'text',
	title: null,
}

Field.propTypes = {
	autocomplete: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
	helperText: PropTypes.string,
	iconLeft: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
	]),
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	label: PropTypes.string,
	maxLength: PropTypes.number,
	minLength: PropTypes.number,
	options: PropTypes.object,
	shouldDebounceBy: PropTypes.number,
	showLabel: PropTypes.bool,
	title: PropTypes.string,
	type: PropTypes.string,
	validate: PropTypes.func,
}

export { Field }
