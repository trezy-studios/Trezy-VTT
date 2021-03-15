// Module imports
import { useCallback, useEffect} from 'react'
import { useRouter } from 'next/router'

// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import * as campaignHelper from '../helpers/campaign'

export default function CampaignPage() {
	const {
		isLoggedIn
		,user
	} = useAuth()

	const router = useRouter()
	useEffect(() => 
	{
		if (!isLoggedIn)
		{
			router.push('/login');
		}
	})


	const handleSubmit = useCallback(formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			ValidateAndSaveCampaign(values, user, router)
		}
	}, [ValidateAndSaveCampaign, user])

	return (
		<div>
			<header><h2>Create Campaign</h2></header>
			<Form 
				initialValues={{
					name: '',
					description: ''
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
					isRequired
					label="Description"
					type="text"
					maxLength={300} />

				<FormButton
					type="submit"
					isDisabled={!isLoggedIn}>
					Create
				</FormButton>
			</Form>
		</div>
		
	)
}

async function ValidateAndSaveCampaign(campaign, user, router)
{
	campaign.ownerID = user.uid
	campaign.gameType = 'D&D 5e'
	try 
	{
		let newCampaign = await campaignHelper.createCampaign(campaign);
		router.push('/dashboard?campaignID=' + newCampaign.id)
	}
	catch(e)
	{
		alert("Unexpected error saving campaign: " + e)
	}
}
