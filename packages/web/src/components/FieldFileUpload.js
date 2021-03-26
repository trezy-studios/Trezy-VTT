// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import { useForm } from 'components/Form'





function FieldFileUpload(props) {
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
	const [file, setFile] = useState(null)

	const validate = useCallback(async state => {
		const errors = []

		if (isRequired && !state) {
			errors.push('Field is required')
		}

		if (typeof props.validate === 'function') {
			const customError = await props.validate(state)
			if (customError) {
				errors.push(customError)
			}
		}

		updateValidity(id, errors)
	}, [
		updateValidity,
		props.validate,
	])

	const handleChange = useCallback(event => {
		const [file] = event.target.files
		setFile(file)
		updateValue(id, file)
		validate(file, props)
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

	return (
		<div
			className={classnames({
				file: true,
				'has-name': file,
				'is-right': file,
			})}>
			<span className="file-label">
				<input
					className="file-input"
					name="resume"
					onChange={handleChange}
					type="file" />

				<span className="file-cta">
					<span className="file-icon">
						<FontAwesomeIcon
							fixedWidth
							icon="upload" />
					</span>

					<span className="file-label">
						{'Choose a file…'}
					</span>
				</span>

				{Boolean(file) && (
					<span className="file-name">
						{file.name}
					</span>
				)}
			</span>
		</div>
	)
}

FieldFileUpload.defaultProps = {
	className: null,
	isDisabled: false,
	isRequired: false,
	validate: () => {},
}

FieldFileUpload.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
	isRequired: PropTypes.bool,
	validate: PropTypes.func,
}

export { FieldFileUpload }
