// Module imports
import { useCallback } from 'react'





// Local imports
import { Button } from 'components/Button'
import { CharactersList } from 'components/CharactersList'
import { useModals } from 'contexts/ModalsContext'
import { useRedirectOnLoggedOut } from 'hooks/useRedirectOnLoggedOut'





export default function CharactersDashboardPage() {
	const { openModal } = useModals()

	const handleCreateCharacterClick = useCallback(() => openModal('character'), [openModal])

	useRedirectOnLoggedOut()

	return (
		<section className="section">
			<header className="level">
				<h2 className="title level-left">
					My Characters
				</h2>

				<Button
					className="is-primary level-right"
					onClick={handleCreateCharacterClick}>
					Create Character
				</Button>
			</header>

			<CharactersList />
		</section>
	)
}
