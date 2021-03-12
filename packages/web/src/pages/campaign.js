// Module imports
import { useCallback, useEffect} from 'react'
import { useRouter } from 'next/router'

// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'
import {firestore, firebase} from '../helpers/firebase'


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

function ValidateAndSaveCampaign(campaign, user, router)
{
	if (user.uid && campaign.description && campaign.name)
	{
		let isFirst = false;
    	var campaignsCollection = firestore.collection('campaigns');
		campaignsCollection
			.where("ownerID", "==", user.uid)
			.get()
			.then((querySnapshot) => {
				if (querySnapshot.empty)
				{
					isFirst = true;
				}
				
				let newCampaign = campaignsCollection.doc()

				newCampaign.set({
					'name': campaign.name,
					'description': campaign.description,
					'gameType': 'D&D 5e',
					'ownerID': user.uid,
					'createdAt': firebase.firestore.Timestamp.now(),
					'updatedAt': firebase.firestore.Timestamp.now(),
					'isActive': isFirst
				})

				router.push('/dashboard?campaignID=' + newCampaign.id)

			})
			.catch((error) => {
				console.log("Error getting campaigns: ", error);
			});
	}
	else
	{
		alert("Unexpected error saving campaign")
	}
	
}
