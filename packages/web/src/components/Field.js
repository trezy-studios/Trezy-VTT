// Module imports
import { Children } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { useForm } from 'components/Form'





function Field(props) {
	const {
		children,
		className,
		helperText,
		id,
		isRequired,
		label,
	} = props
	const { errors: formErrors } = useForm()

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

	if (label) {
		renderedLabel = (
			<label
				className="label"
				htmlFor={id}>
				{label}
				{isRequired && (
					<span className="has-text-danger">{'*'}</span>
				)}
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
		<div className="field">
			{renderedLabel}
			{children}
			{renderedHelpers}
		</div>
	)
}

Field.defaultProps = {
	children: null,
	className: null,
	helperText: null,
	isRequired: false,
	label: null,
}

Field.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	helperText: PropTypes.string,
	id: PropTypes.string.isRequired,
	isRequired: PropTypes.bool,
	label: PropTypes.string,
}

export { Field }
