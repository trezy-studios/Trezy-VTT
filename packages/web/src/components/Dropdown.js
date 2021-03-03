//Generic dropdown

// Module imports
import PropTypes from 'prop-types'

function Dropdown(props){

    const {
		label,
		isDisabled,
        children,
	} = props

    return (
        <div className="dropdown">
            <label>{label}: </label>
            <select className="selectpicker" disabled={isDisabled}>
                {children}
            </select>
        </div>
    )
}

Dropdown.defaultProps = {
	isDisabled: false,
}

Dropdown.propTypes = {
    label: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
    children: PropTypes.node.isRequired,
}

export {Dropdown}