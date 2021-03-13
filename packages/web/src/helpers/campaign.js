import {firestore, firebase} from './firebase'


/**
 * Saves a campaign to the Firestore campaigns collection
 * @param {*} campaign - The campaign object to be saved. We expect this campaign object
 * to be populated with all relevant properties checked in validCampaign
 * @returns If successful, returns the campaign object saved
 * Otherwise, returns rejected promise
 */
export async function saveCampaign(campaign)
{
    if (!validCampaign(campaign))
    {
        return Promise.reject('Invalid campaign object');
    }
    let campaignToSave = firestore.collection('campaigns').doc(campaign.id)
    try{
        await campaignToSave.set(
        {
            'name': campaign.name,
            'description': campaign.description,
            'gameType': campaign.gameType,
            'ownerID': campaign.ownerID,
            'createdAt': campaign.createdAt ?? firebase.firestore.Timestamp.now(),
            'updatedAt': firebase.firestore.Timestamp.now(),
            'isActive': campaign.isActive
        })
        return campaignToSave
    }
    catch
    {
        return Promise.reject('Failed to save campaign to Firestore')
    }
    
}
/**
 * Saves a new campaign to the firestore campaigns collection
 * @param {*} newCampaign Campaign object that we expect to be populated
 * with a name, game type, description, and owner ID
 * @returns If successful, The new campaign object added 
 * Otherwise, null
 */
export async function createCampaign(newCampaign)
{
    newCampaign.isActive = false;
    let activeCampaigns = await firestore.collection('campaigns')
                            .where("ownerID", "==", newCampaign.ownerID)
                            .where("isActive", "==", true)
                            .get()
    if (activeCampaigns.docs.length === 0)
    {
        newCampaign.isActive = true;
    }
    newCampaign.id = firestore.collection('campaigns').doc().id
    return saveCampaign(newCampaign);
}

/**
 * Validates that an object is valid for saving to the Firestore campaigns collection
 * To-do: Convince Trezy that using TS for Type-checking database objects is worthwhile
 * @param {*} campaign 
 * @returns True if campaign object is valid. Otherwise false
 */
export function validCampaign(campaign)
{
    if
    (
        typeof campaign.id === 'string'
        && typeof campaign.name === 'string'
        && typeof campaign.description === 'string'
        && typeof campaign.gameType === 'string'
        && typeof campaign.isActive === 'boolean'
        && typeof campaign.ownerID === 'string'
    )
    {
        return true;
    }
   return false;
}

