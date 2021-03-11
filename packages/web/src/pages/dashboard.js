//import modules
import { useRouter } from 'next/router'

import { Button } from 'components/Button'

export default function DashboardPage() {
	const router = useRouter();
	return (
		<div>
			<div>
				Dashboard
			</div>
			<div>
			<Button onClick={() => {router.push('/campaign')}}>
				Create Campaign
			</Button>
			</div>
		</div>

	)
}
