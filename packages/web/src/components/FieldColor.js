// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { ChromePicker } from 'react-color'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Button'
import { getReadableTextColorForBackground } from 'helpers/getReadableTextColorForBackground'
import { useForm } from 'components/Form'





function FieldColor(props) {
	const {
		className,
		id,
		isDisabled,
		isRequired,
	} = props
	const {
		errors: formErrors,
		updateValidity,
		updateValue,
		values,
	} = useForm()
	const [shouldShowColorPicker, setShouldShowColorPicker] = useState(false)
	const buttonRef = useRef(null)
	const dropdownRef = useRef(null)

	const hideColorPicker = useCallback(() => setShouldShowColorPicker(false))
	const toggleColorPicker = useCallback(() => setShouldShowColorPicker(previousState => !previousState))

	const validate = useCallback(async (state, initialProps) => {
		const errors = []

		if (initialProps.isRequired && !state) {
			errors.push('Field is required')
		}

		if (!/^#(?:[0-9a-f]){6}$/i.test(state)) {
			errors.push(`${state} isn't a valid color`)
		}

		if (typeof initialProps.validate === 'function') {
			const customError = await initialProps.validate(state)
			if (customError) {
				errors.push(customError)
			}
		}

		updateValidity(id, errors)
	}, [updateValidity])

	const handleChange = useCallback(value => {
		updateValue(id, value.hex)
		validate(value.hex, props)
	}, [
		id,
		props,
		updateValue,
		validate,
	])

	useEffect(() => {
		// Run a validity check against a field's initial state if it's non-empty
		if (isRequired && (values[id] !== '')) {
			validate(values[id], props)
		} else {
			updateValidity(id, [])
		}
	}, [])

	useEffect(() => {
		if (shouldShowColorPicker) {
			const handleRemoteClick = ({ target }) => {
				const buttonElement = buttonRef.current
				const dropdownElement = dropdownRef.current

				if (
					(target !== buttonElement) &&
					(target !== dropdownElement) &&
					!dropdownElement.contains(target)
				) {
					hideColorPicker()
				}
			}

			document.addEventListener('click', handleRemoteClick)
			return () => document.removeEventListener('click', handleRemoteClick)
		}
	}, [shouldShowColorPicker])

	return (
		<div className={classnames('control', className)}>
			<div
				className={classnames({
					dropdown: true,
					'is-active': shouldShowColorPicker,
					'is-fullwidth': true,
					'is-up': true,
				})}>
				<Button
					aria-controls="dropdown-menu7"
					aria-haspopup="true"
					className="is-fullwidth is-white"
					isDisabled={isDisabled}
					onClick={toggleColorPicker}
					ref={buttonRef}
					style={{
						backgroundColor: values[id],
						color: getReadableTextColorForBackground(values[id]),
					}}>
					{values[id]}
				</Button>

				<div
					className="dropdown-menu"
					ref={dropdownRef}>
					<ChromePicker
						color={values[id]}
						onChange={handleChange} />
				</div>
			</div>
		</div>
	)
}

FieldColor.defaultProps = {
	className: null,
	isDisabled: false,
	isRequired: false,
	validate: () => {},
}

FieldColor.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	validate: PropTypes.func,
}

export { FieldColor }
