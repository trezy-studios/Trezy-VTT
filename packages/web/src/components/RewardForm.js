// Module imports
import {
	useCallback,
	useEffect,
    useState,
} from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { ChromePicker } from 'react-color';

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

    let [rewardColor, setRewardColor] = useState(5);
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
				maxLength={25}
                title="Enter a name for Twitch reward" />

			<Field
				id="cost"
                isRequired
				label="Cost"
				type="number"
                title="Enter channel points cost of reward"/>
            <div>
             <Field
                id="maxRedemptions"
                label="Max Redemptions Per Stream"
                type="number"
                title="Enter maximum number of redemptions per stream for reward"/>
            <label class="checkbox">
            <input
                id="perUser"
                type="checkbox"
                title="Check if max redemptions are per user"/>
                {" Per User"}
            </label>
            </div>
            <Field
                id="cooldown"
                label="Cooldown"
                type="number"
                title="Enter reward cooldown in seconds"/>
            <Field
				id="color"
                label="HiddenColor"
                type="hidden"
                value={rewardColor}/>
            <label className="label">Color</label>
            <div title="Select a reward color">
                <ChromePicker color={rewardColor} onChange={(color) => {setRewardColor(color)}}/>
            </div>
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
