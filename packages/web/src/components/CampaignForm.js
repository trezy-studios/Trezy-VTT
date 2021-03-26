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
import { FieldControl } from 'components/FieldControl'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import { useCampaigns } from 'contexts/CampaignsContext'
import { useModals } from 'contexts/ModalsContext'





function CampaignForm(props) {
	const { isModal } = props
	const { closeModal } = useModals()
	const { createCampaign } = useCampaigns()
	const { user } = useAuth()
	const Router = useRouter()

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				const newCampaignID = await createCampaign({ ...values })
				closeModal('campaign')
				Router.push(`/campaigns/${newCampaignID}`)
			} catch(error) {
				alert(`Unexpected error saving campaign: ` + error)
			}
		}
	}, [createCampaign])

	return (
		<Form
			initialValues={{
				description: '',
				gameID: 'dnd5e',
				name: '',
			}}
			onSubmit={handleSubmit}>
			<Field
				id="name"
				isRequired
				label="Name">
				<FieldControl
					id="name"
					isRequired
					maxLength={50} />
			</Field>

			<Field
				id="description"
				label="Description">
				<FieldControl
					id="description"
					maxLength={300} />
			</Field>

			<Field
				id="gameID"
				label="Game"
				type="hidden"
				value="dnd5e" />

			<menu type="toolbar">
				<div className="menu-right">
					<FormButton
						className="is-primary"
						type="submit">
						Create Campaign
					</FormButton>
				</div>
			</menu>
		</Form>
	)
}

CampaignForm.defaultProps = {
	isModal: false,
}

CampaignForm.propTypes = {
	isModal: PropTypes.bool,
}

export { CampaignForm }
