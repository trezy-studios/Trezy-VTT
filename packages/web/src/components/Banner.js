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
import { Button } from 'components/Button'
import { useAuth } from 'contexts/AuthContext'
import { useModals } from 'contexts/ModalsContext'





export function Banner() {
	const Router = useRouter()
	const timeoutID = useRef(null)
	const {
		isLoggedIn,
		logout,
	} = useAuth()
	const {
		openModal,
	} = useModals()
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

	const handleLoginClick = useCallback(() => openModal('login'), [openModal])
	const handleSignUpClick = useCallback(() => openModal('registration'), [openModal])

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
							{'Home'}
						</a>
					</Link>

					{isLoggedIn && (
						<div className="navbar-item has-dropdown is-hoverable">
							<Link href="/dashboard">
								<a className="navbar-link">
									{'Dashboard'}
								</a>
							</Link>

							<div className="navbar-dropdown">
								<Link href="/campaigns">
									<a className="navbar-item">
										{'My Campaigns'}
									</a>
								</Link>

								<Link href="/characters">
									<a className="navbar-item">
										{'My Characters'}
									</a>
								</Link>

								{/* <hr className="navbar-divider" /> */}
							</div>
						</div>
					)}
				</div>

				<div className="navbar-end">
					{isLoggedIn && (
						<div className="navbar-item has-dropdown is-hoverable">
							<Link href="/dashboard">
								<a className="navbar-link">
									{'My Account'}
								</a>
							</Link>

							<div className="navbar-dropdown is-right">
								<Link href="/dashboard">
									<a className="navbar-item">
										{'Profile'}
									</a>
								</Link>

								<Link href="/settings/general">
									<a className="navbar-item">
										{'Settings'}
									</a>
								</Link>

								<hr className="navbar-divider" />

								<Link href="/version">
									<a className="navbar-item">
										{'Version 0.0.0'}
									</a>
								</Link>
							</div>
						</div>
					)}

					<div className="navbar-item">
						<div className="buttons">
							{isLoggedIn && (
								<Button
									className="is-light"
									onClick={logout}>
									<strong>{'Logout'}</strong>
								</Button>
							)}

							{!isLoggedIn && (
								<>
									<Button
										className="is-primary"
										onClick={handleSignUpClick}>
										<strong>{'Sign up'}</strong>
									</Button>

									<Button
										className="is-light"
										onClick={handleLoginClick}>
										<strong>{'Login'}</strong>
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
