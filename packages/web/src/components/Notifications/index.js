// Module imports
import classnames from 'classnames'





// Local imports
import { useNotifications } from 'contexts/NotificationsContext'





export function Notifications() {
	const {
		closeNotification,
		notifications,
	} = useNotifications()

	return (
		<div className="notifications">
			{notifications.map(notification => {
				const {
					id,
					message,
					title,
					type,
				} = notification

				const classnamesObject = {
					message: true,
					'is-small': true,
				}

				if (type) {
					classnamesObject[`is-${type}`] = true
				}

				return (
					<article
						className={classnames(classnamesObject)}
						key={id}>
						<div className="message-header">
							<p>{title}</p>
							<button
								aria-label="delete"
								className="delete"
								onClick={() => closeNotification(notification)} />
						</div>
						<div className="message-body">
							{message}
						</div>
					</article>
				)
			})}
		</div>
	)
}
