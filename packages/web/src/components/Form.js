// Module imports
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useReducer,
} from 'react'
import PropTypes from 'prop-types'





// Local imports
import {
	auth,
	firestore,
} from 'helpers/firebase'





// Constants
const INITIAL_STATE = {
	errors: {},
	isValid: false,
	isTouched: false,
	touched: {},
	validity: {},
	values: {},
}





function reducer(state, action) {
	const {
		payload,
		type,
	} = action
	const newState = {
		...INITIAL_STATE,
		...state,
	}

	switch (type) {
		case 'validity changed':
			newState.validity = {
				...newState.validity,
				[payload.fieldName]: !payload.errors?.length,
			}
			newState.errors = {
				...newState.errors,
				[payload.fieldName]: payload.errors,
			}
			newState.isValid = !Object
				.values(newState.validity)
				.some(isValid => !isValid)
			break

		case 'value changed':
			newState.values = {
				...newState.values,
				[payload.fieldName]: payload.value,
			}
			newState.touched = {
				...newState.touched,
				[payload.fieldName]: newState.initialValues[payload.fieldName] !== payload.value,
			}
			newState.isTouched = Object
				.values(newState.touched)
				.some(isTouched => isTouched)
			break

		default:
			console.warn(`Unrecognized action dispatched: ${type}`, payload)
			return state
	}

	return newState
}





const FormContext = createContext({
	...INITIAL_STATE,
	updateValidity: () => {},
	updateValue: () => {},
})

const Form = props => {
	const {
		children,
		initialValues,
		onSubmit,
	} = props
	const [state, dispatch] = useReducer(reducer, {
		...INITIAL_STATE,
		errors: Object
			.keys(initialValues)
			.reduce((accumulator, key) => {
				accumulator[key] = []
				return accumulator
			}, {}),
		initialValues,
		touched: Object
			.keys(initialValues)
			.reduce((accumulator, key) => {
				accumulator[key] = false
				return accumulator
			}, {}),
		validity: Object
			.keys(initialValues)
			.reduce((accumulator, key) => {
				accumulator[key] = false
				return accumulator
			}, {}),
		values: { ...initialValues },
	})

	const handleSubmit = useCallback(event => {
		event.preventDefault()
		onSubmit(state)
	}, [
		onSubmit,
		state,
	])

	const updateValidity = useCallback((fieldName, errors) => {
		dispatch({
			payload: {
				errors,
				fieldName,
			},
			type: 'validity changed',
		})
	}, [dispatch])

	const updateValue = useCallback((fieldName, value) => {
		dispatch({
			payload: {
				fieldName,
				value,
			},
			type: 'value changed',
		})
	}, [
		dispatch,
	])

	return (
		<FormContext.Provider
			value={{
				...state,
				updateValidity,
				updateValue,
			}}>
			<form onSubmit={handleSubmit}>
				{children}
			</form>
		</FormContext.Provider>
	)
}

Form.propTypes = {
	initialValues: {},
	onSubmit: () => {},
}

Form.propTypes = {
	children: PropTypes.node.isRequired,
	initialValues: PropTypes.object,
	onSubmit: PropTypes.func,
}

const useForm = () => useContext(FormContext)





export {
	FormContext,
	Form,
	useForm,
}
