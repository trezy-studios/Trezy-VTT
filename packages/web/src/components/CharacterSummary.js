// Module imports
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'





export function CharacterSummary(props) {
	const {
		character,
		id,
	} = props

	return (
		<div className="card">
			<div className="card-image">
				<figure className="image">
					<img src="/temp/whistle.main.png" alt="Blep" />
				</figure>
			</div>

			<div className="card-content">
				<div className="media">
					<div className="media-left">
						<figure className="image is-48x48">
							<img src="/temp/whistle.token.png" alt={`Token for ${character.name}`} />
						</figure>
					</div>

					<div className="media-content">
						<p className="title is-4">Dungeons &amp; Dragons: Fifth Edition</p>
						<p className="subtitle is-6"><a href="https://dnd.wizards.com">https://dnd.wizards.com</a></p>
					</div>
				</div>
			</div>

			<footer className="card-footer">
				<div className="card-footer-item">
					<span>
						{'View '}
						<Link href={`/characters/${id}`}>
							<a>{'Character Sheet'}</a>
						</Link>
					</span>
				</div>
			</footer>
		</div>
	)
}
