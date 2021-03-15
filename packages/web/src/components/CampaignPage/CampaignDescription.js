// Module imports
import ReactMarkdown from 'react-markdown'





// Module imports
import { FontAwesomeIcon } from 'components/FontAwesomeIcon'
import PropTypes from 'prop-types'





function CampaignDescription(props) {
	const { description } = props

	return (
		<details
			className="card"
			open>
			<summary className="card-header">
				<p className="card-header-title">Description</p>
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
					<ReactMarkdown>{description}</ReactMarkdown>
				</div>
			</div>
			<footer className="card-footer">
				<a href="#" className="card-footer-item">Edit</a>
			</footer>
		</details>
	)
}

CampaignDescription.propTypes ={
	description: PropTypes.string.isRequired,
}

export { CampaignDescription }
