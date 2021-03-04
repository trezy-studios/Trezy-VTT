// Module imports
import PropTypes from 'prop-types'





// Local imports
import { Button } from 'components/Button'
import { useForm } from 'components/Form'





function FormButton(props) {
	const {
		children,
		isDisabled,
	} = props
	const {
		isTouched,
		isValid,
	} = useForm()

	return (
		<Button
			{...props}
			isDisabled={isDisabled || !isValid || !isTouched}>
			{children}
		</Button>
	)
}

FormButton.defaultProps = {
	isDisabled: false,
}

FormButton.propTypes = {
	children: PropTypes.node.isRequired,
	isDisabled: PropTypes.bool,
}

export { FormButton }
