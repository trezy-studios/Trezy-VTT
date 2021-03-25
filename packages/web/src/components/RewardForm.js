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
				cooldown: 0,
				cost: 100,
				isMaxRedemptionsPerUser: false,
				maxRedemptions: 0,
				optionzorz: '',
				title: '',
			}}
			onSubmit={handleSubmit}>
			<Field
				id="title"
				label="Name">
				<FieldControl
					id="title"
					isRequired
					type="text" />
			</Field>

			<Field
				helperText="How many channel points does it cost to redeem this reward?"
				id="cost"
				label="Cost">
				<FieldControl
					id="cost"
					isRequired
					min={1}
					type="number" />
			</Field>

			<Field
				helperText="Maximum number of times this reward can be redeemed per stream"
				id="maxRedemptions"
				label="Max Redemptions Per Stream">
				<FieldControl
					className="is-expanded"
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
				helperText="Cooldown timer in seconds"
				id="cooldown"
				label="Cooldown">
				<FieldControl
					id="cooldown"
					min={1}
					type="number" />
			</Field>

			<Field
				helperText="This is the color that will be used on Twitch"
				id="color"
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
