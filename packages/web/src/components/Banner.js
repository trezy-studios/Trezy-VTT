// Module imports
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { useRouter } from 'next/router'
import classnames from 'classnames'
import Link from 'next/link'





// Local imports
import { useAuth } from 'contexts/AuthContext'





export function Banner() {
	const Router = useRouter()
	const timeoutID = useRef(null)
	const { isLoggedIn } = useAuth()
	const [isExpanded, setIsExpanded] = useState(false)

	const handleExpandClick = useCallback(() => {
		setIsExpanded(previousValue => !previousValue)
	}, [setIsExpanded])

	const close = useCallback(() => {
		setIsExpanded(false)
	}, [setIsExpanded])

	const handleMouseOver = useCallback(() => {
		if (timeoutID.current) {
			clearTimeout(timeoutID.current)
			timeoutID.current = null
		}
	}, [])

	const handleMouseOut = useCallback(() => {
		timeoutID.current = setTimeout(close, 1000)
	}, [close])

	useEffect(() => {
		Router.events.on('routeChangeComplete', close)
		return () => Router.events.off('routeChangeComplete', close)
	}, [close])

	return (
		<nav
			aria-label="main navigation"
			className="navbar"
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
			role="navigation">
			<div className="navbar-brand">
				<Link href="/">
					<a className="navbar-item">
						<img
							height="28"
							src="https://bulma.io/images/bulma-logo.png"
							width="112" />
					</a>
				</Link>

				<button
					aria-expanded={isExpanded}
					aria-label="menu"
					className="navbar-burger"
					onClick={handleExpandClick}>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</button>
			</div>

			<div
				className={classnames({
					'is-active': isExpanded,
					'navbar-menu': true,
				})}
				hidden={!isExpanded}>
				<div className="navbar-start">
					<Link href="/">
						<a className="navbar-item">
							Home
						</a>
					</Link>

					{isLoggedIn && (
						<Link href="/dashboard">
							<a className="navbar-item">
								Dashboard
							</a>
						</Link>
					)}
				</div>

				<div className="navbar-end">
					<div className="navbar-item">
						<div className="buttons">
							{isLoggedIn && (
								<Link href="/login">
									<a className="button is-light">
										Logout
									</a>
								</Link>
							)}

							{!isLoggedIn && (
								<>
									<Link href="/register">
										<a className="button is-primary">
											<strong>Sign up</strong>
										</a>
									</Link>

									<Link href="/login">
										<a className="button is-light">
											Login
										</a>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
