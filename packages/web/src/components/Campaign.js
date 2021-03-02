//Create a form for saving a campaign

//Module imports
import {Field} from './Field';
import {Button} from './Button';
import {Dropdown} from './Dropdown';

function Campaign()
{
    return (
            <div>
                <Field isDisabled={false} label='Campaign Name' type='text'/>
                <Field isDisabled={false} label='Description' type='text' />
                <Dropdown isDisabled={false} label='Game Type'>
                    <option>DnD 5e</option>
                </Dropdown>
                <Button isDisabled={false} onClick={SaveCampaign}>Save</Button>
                

            </div>
            )
}

function SaveCampaign()
{
    console.log("To do: Implement saving campaign");
}

export { Campaign }