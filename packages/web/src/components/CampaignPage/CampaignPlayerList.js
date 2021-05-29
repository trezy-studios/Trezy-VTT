// Module imports
import ReactMarkdown from 'react-markdown'





// Module imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import PropTypes from 'prop-types'
import {useState} from 'react'
import {InviteModal} from 'components/InviteModal'





function mapPlayer(item, index) {
	return (
		<li key={index}>
			Player {index}
		</li>
	)
}

function CampaignPlayerList(props) {
	const { players } = props

	const [shouldShowInviteModal, setShouldShowInviteModal] = useState(false)
	const handleCreateInviteClick = () => setShouldShowInviteModal(true)

	return (
		<details
			className="card"
			open>
			<summary className="card-header">
				<p className="card-header-title">{'Players'}</p>
				<span className="card-header-icon">
					<span className="icon">
						<FontAwesomeIcon
							aria-hidden="true"
							fixedWidth
							icon="angle-down" />
					</span>
				</span>
			</summary>

			<div className="card-content">
				<div className="content">
					{!players.length && (
						<p>{'No players.'}</p>
					)}

					{Boolean(players.length) && (
						<ul>
							{players.map(mapPlayer)}
						</ul>
					)}
				</div>
			</div>

			<footer className="card-footer">
				<a href="#" className="card-footer-item" onClick={handleCreateInviteClick}>{'Invite Players'}</a>
			</footer>
			{shouldShowInviteModal && (
				<InviteModal
					showModal={setShouldShowInviteModal} />
			)}
		</details>
	)
}

CampaignPlayerList.propTypes = {
	players: PropTypes.array.isRequired,
}

export { CampaignPlayerList }
