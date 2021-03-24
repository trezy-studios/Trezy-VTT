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
import { useCampaigns } from 'contexts/CampaignsContext'
import API from 'helpers/API'





function RewardForm(props) {
	const { campaign, showModal } = props
	const { user } = useAuth()
	const { createReward } = useCampaigns()
	const Router = useRouter()

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				await createReward(values, campaign.id)
				showModal(false)
			} catch(error) {
				alert(`Unexpected error saving reward: ` + error)
			}
		}
	}, [])

	return (
		<Form
			initialValues={{
				title: '',
				cost: 100,
				isMaxRedemptionsPerUser: false,
				maxRedemptions: 0,
				cooldown: 0,
				color: '',
			}}
			onSubmit={handleSubmit}>
			<Field
				id="title"
				isRequired
				label="Name"
				type="text"
				title="Enter a name for Twitch reward" />

			<Field
				id="cost"
				isRequired
				label="Cost"
				type="number"
				title="Enter channel points cost of reward"/>

			<Field
				id="maxRedemptions"
				label="Max Redemptions Per Stream"
				type="number"
				title="Enter maximum number of redemptions per stream for reward" />

			<Field
				id="isMaxRedemptionsPerUser"
				type="checkbox"
				title="Check if max redemptions are per user"
				label="Per User" />

			<Field
				id="cooldown"
				label="Cooldown"
				type="number"
				title="Enter reward cooldown in seconds" />

			<Field
				id="color"
				label="Color"
				type="chromepicker"
				title="Select a reward color" />

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
