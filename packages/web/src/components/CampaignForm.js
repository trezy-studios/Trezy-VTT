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
import * as campaignHelper from 'helpers/campaign'





function CampaignForm(props) {
	const { isModal } = props
	const { closeModal } = useModals()
	const { user } = useAuth()
	const Router = useRouter()

	const handleSubmit = useCallback(async formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			try {
				const newCampaign = await campaignHelper.createCampaign({
					...values,
					gameType: 'D&D 5e',
					ownerID: user.uid,
				})
				Router.push(`/campaigns/${newCampaign.id}`)
			} catch(error) {
				alert(`Unexpected error saving campaign: ` + error)
			}
		}
	}, [user])

	return (
		<Form
			initialValues={{
				name: '',
				description: '',
			}}
			onSubmit={handleSubmit}>
			<Field
				id="name"
				isRequired
				label="Name"
				type="text"
				maxLength={50} />

			<Field
				id="description"
				label="Description"
				type="text"
				maxLength={300} />

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
