//Generic entry field. Contains a label and 
// Module imports
import PropTypes from 'prop-types'

function Field(props){
    const {
		label,
		isDisabled,
		type,
	} = props

    return (
        <div className='field'>
            <label>{label}: 
            <input 
                type={type} 
                disabled={isDisabled}>
            </input>
            </label>
        </div>
    )
}

Field.defaultProps = {
	isDisabled: false,
	type: 'text',
}

Field.propTypes = {
    label: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
    type: PropTypes.string,
}

export {Field}