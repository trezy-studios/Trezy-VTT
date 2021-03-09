// Module imports
import { useCallback} from 'react'

// Local imports
import { Field } from 'components/Field'
import { Form } from 'components/Form'
import { FormButton } from 'components/FormButton'
import { useAuth } from 'contexts/AuthContext'

export default function CampaignPage() {

	const {
		isLoggedIn
		,user
	} = useAuth()

	//To-do: redirect user to login if not logged in
	const handleSubmit = useCallback(formState => {
		const {
			isValid,
			values,
		} = formState

		if (isValid) {
			ValidateAndSaveCampaign(values,user)
		}
	}, [ValidateAndSaveCampaign])

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

function ValidateAndSaveCampaign(campaign,user)
{

    console.log("To do: Implement saving campaign: " + JSON.stringify(campaign))
	console.log(user.uid)
	/*
    var campaignsCollection = firestore.collection('campaigns');
    campaignsCollection.add({
        'name': 'testName',
        'description': 'testDescription',
        'gametype': 'DnD 5e'
    });
	*/
}