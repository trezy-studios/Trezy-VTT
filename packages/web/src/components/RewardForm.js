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
import { FieldCheckbox } from 'components/FieldCheckbox'
import { FieldColor } from 'components/FieldColor'
import { FieldControl } from 'components/FieldControl'
import { FieldRadioGroup } from 'components/FieldRadioGroup'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { generateRandomHexColor } from 'helpers/generateRandomHexColor'
import { useAuth } from 'contexts/AuthContext'
import { useCampaigns } from 'contexts/CampaignsContext'
import API from 'helpers/API'





function RewardForm(props) {
	const {
		campaignID,
		showModal,
	} = props
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
				await createReward(values, campaignID)
				showModal(false)
			} catch(error) {
				alert(`Unexpected error saving reward: ` + error)
			}
		}
	}, [])

	return (
		<Form
			initialValues={{
				color: generateRandomHexColor(),
				cooldown: '',
				cost: 100,
				isMaxRedemptionsPerUser: false,
				maxRedemptions: '',
				title: '',
			}}
			onSubmit={handleSubmit}>
			<Field
				id="title"
				isRequired
				label="Name">
				<FieldControl
					id="title"
					isRequired
					type="text" />
			</Field>

			<Field
				helperText="How many channel points does it cost to redeem this reward?"
				id="cost"
				isRequired
				label="Cost">
				<FieldControl
					alignment="right"
					id="cost"
					isRequired
					min={1}
					type="number" />

				<p class="control">
					<span class="button is-static">
						bits
					</span>
				</p>
			</Field>

			<Field
				helperText="How many times can this reward can be redeemed per stream?"
				id="maxRedemptions"
				label="Max Redemptions">
				<FieldControl
					alignment="right"
					id="maxRedemptions"
					min={0}
					type="number" />

				<div className="control">
					<label className="button">
						<FieldCheckbox
							id="isMaxRedemptionsPerUser"
							label="Per user" />
					</label>
				</div>
			</Field>

			<Field
				helperText="How much time must pass before this reward can be redeemed again?"
				id="cooldown"
				label="Cooldown">
				<FieldControl
					alignment="right"
					id="cooldown"
					min={0}
					type="number" />

				<p class="control">
					<span class="button is-static">
						seconds
					</span>
				</p>
			</Field>

			<Field
				helperText="This is the color that will be used on Twitch"
				id="color"
				isRequired
				label="Color">
				<FieldColor id="color" />
			</Field>

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
	campaignID: PropTypes.string.isRequired,
}

export { RewardForm }
