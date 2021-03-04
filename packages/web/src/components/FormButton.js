// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Button'
import { useForm } from 'components/Form'





function FormButton(props) {
	const {
		children,
		isDisabled,
		type,
	} = props
	const {
		isTouched,
		isValid,
	} = useForm()

	return (
		<Button
			isDisabled={isDisabled || !isValid || !isTouched}
			type={type}>
			{children}
		</Button>
	)
}

FormButton.defaultProps = {
	isDisabled: false,
	type: 'button',
}

FormButton.propTypes = {
	children: PropTypes.node.isRequired,
	isDisabled: PropTypes.bool,
	type: PropTypes.string,
}

export { FormButton }
