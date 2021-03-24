// Module imports
import {
	useCallback,
	useEffect,
    useState,
} from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'


// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import API from 'helpers/API'



function RewardForm(props) {
	const { campaign, showModal } = props
	const { user } = useAuth()
	const Router = useRouter()


	  const createReward = useCallback(async (reward, campaign) => {
        reward.uid = campaign.ownerID
        reward.campaignID = campaign.id
		console.log(reward)
		console.log(campaign)
		const response = await API.post({
			body: reward,
			route: '/rewards/new',
		})
		const responseJSON = await response.json()
		return responseJSON.id
	}, [])

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				const newRewardID = await createReward(values, campaign)
                showModal(false);
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
                maxRedemptions: '',
				perUser: false,
                cooldown: '',
				color: '',
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
            <div className="redemptionFields">
             <Field
                id="maxRedemptions"
                label="Max Redemptions Per Stream"
                type="number"
                title="Enter maximum number of redemptions per stream for reward"/>
			<Field
				id="perUser"
				type="checkbox"
				title="Check if max redemptions are per user"
				label=" Per User"/>
            </div>
            <Field
                id="cooldown"
                label="Cooldown"
                type="number"
                title="Enter reward cooldown in seconds"/>
			<Field
				id="color"
				label="Color"
				type="chromepicker"
				title="Select a reward color"
			/>
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
	campaign: PropTypes.object
}

export { RewardForm }
