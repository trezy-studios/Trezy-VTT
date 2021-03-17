// Module imports
import {
	useCallback,
	useEffect,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useModals } from 'contexts/ModalsContext'


function RewardForm(props) {
	const { isModal } = props
	const { closeModal } = useModals()
	const { user } = useAuth()
	const Router = useRouter()

    const redemptionOptions={
        user: { label: 'Per User' },
        stream: { label: 'Per Stream' },
      }

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				console.log("Creating reward")
                closeModal('reward');
			} catch(error) {
				alert(`Unexpected error saving reward: ` + error)
			}
		}
	}, [])
	return (
		<Form
			initialValues={{
				title: '',
				cost: '',
                color: '',
                maxRedemptions: '',
                cooldown: ''
			}}
			onSubmit={handleSubmit}>
			<Field
				id="title"
				isRequired
				label="Name"
				type="text"
				maxLength={25} />

			<Field
				id="cost"
                isRequired
				label="Cost"
				type="number"/>

			<Field
				id="color"
				label="Color"
                type="text"/>
            <span>
             <Field
                id="maxRedemptions"
                label="Max Redemptions"
                type="number"/>

            <Field
                id="maxRedemptionsPerUser"
                type="radio"
                label="Uses Per"
                options={redemptionOptions}/>
            </span>
            <Field
                id="cooldown"
                label="Cooldown"
                type="number"/>
			<menu type="toolbar">
				<div className="menu-right">
					<FormButton
						className="is-primary"
						type="submit">
						Create Reward
					</FormButton>
				</div>
			</menu>
		</Form>
	)
}

RewardForm.defaultProps = {
	isModal: false,
}

RewardForm.propTypes = {
	isModal: PropTypes.bool,
}

export { RewardForm }
