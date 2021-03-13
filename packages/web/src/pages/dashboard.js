//import modules
import Link from 'next/link'

import { Button } from 'components/Button'

export default function DashboardPage() {
	return (
		<div>
			<div>
				Dashboard
			</div>
			<div>
			<Link href="/campaign">
				<a>Create New Campaign</a>
			</Link>
			</div>
		</div>

	)
}

