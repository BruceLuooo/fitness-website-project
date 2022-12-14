/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import {
	browserSessionPersistence,
	getAuth,
	setPersistence,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import Hamburger from '../assets/hamburger.png';
import { useState } from 'react';

const Navbar = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		container: css`
			position: fixed;
			top: 0;
			width: 100%;
			background-color: whitesmoke;
			z-index: 100;
		`,

		navbarContainer: css`
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;
			padding: 0.5rem 1rem;
			${mq1} {
				padding: 0.5rem 0;
			}
		`,
		logo: css`
			text-decoration: none;
			font-weight: 600;
		`,
		logoImage: css`
			width: 50px;
			height: 50px;
			border-radius: 50%;
		`,
		logoFont: css`
			color: black;
			font-size: 30px;
			${mq2} {
				font-size: 20px;
			}
		`,
		navbar: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
			font-size: 20px;
			${mq1} {
				display: none;
			}
		`,
		navbarLogo: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 0.5rem;
			font-size: 20px;
		`,
		navigationItems: css`
			padding: 12px 15px;
			text-decoration: none;
			color: black;
			transition: 0.3s;
			font-size: 22px;
			&:hover {
				opacity: 70%;
				text-shadow: 1px;
			}
			${mq1} {
				font-size: 32px;
				padding: unset;
			}
		`,
		demoLogin: css`
			border: none;
			background-color: whitesmoke;
			font-size: 100%;
			cursor: pointer;
			${mq1} {
				background-color: white;
			}
		`,
		logout: css`
			color: black;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				opacity: 70%;
				text-shadow: 1px;
			}
		`,
		dropDownMenuImage: css`
			display: none;
			${mq1} {
				display: block;
				padding: 1rem;
			}
		`,
		DropdownMenuView: css`
			${mq1} {
				display: contents;
				position: absolute;
				top: 5rem;
				padding-top: 3rem;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				gap: 2rem;
				width: 100%;
				height: 100vh;
				background-color: white;
				font-size: 32px;
			}
		`,
	};

	const navigate = useNavigate();
	const token = sessionStorage.getItem('token');
	const [openMenu, setOpenMenu] = useState<Boolean>(false);

	const logout = () => {
		const auth = getAuth();
		auth.signOut();
		sessionStorage.removeItem('token');
		navigate('/');
		setOpenMenu(false);
	};

	const demoLogin = async () => {
		const auth = getAuth();

		setPersistence(auth, browserSessionPersistence).then(async () => {
			const { user } = await signInWithEmailAndPassword(
				auth,
				`bruceluo@gmail.com`,
				`bruceluo`,
			);

			if (user) {
				const token = await user.getIdToken();
				sessionStorage.setItem('token', token);
				setOpenMenu(false);
				navigate('/profile/overview');
			}
		});
	};

	return (
		<div css={styles.container}>
			<div css={styles.navbarContainer}>
				<a href='/' css={styles.logo}>
					<div css={styles.navbarLogo}>
						<img src={logo} css={styles.logoImage} alt='logo' />
						<div css={styles.logoFont}>NoBull Fitness</div>
					</div>
				</a>
				{token ? (
					<ul css={[styles.navbar, openMenu && styles.DropdownMenuView]}>
						<li>
							<a
								css={styles.navigationItems}
								href='/profile/overview'
								id='profile'
							>
								Profile
							</a>
						</li>
						<li
							css={[styles.navigationItems, styles.logout]}
							onClick={logout}
							id='logout'
						>
							Logout
						</li>
					</ul>
				) : (
					<ul css={[styles.navbar, openMenu && styles.DropdownMenuView]}>
						<li>
							<a css={styles.navigationItems} id='login' href='/login'>
								Login
							</a>
						</li>
						<li>
							<button
								css={[styles.demoLogin]}
								onClick={demoLogin}
								id='demoLogin'
							>
								Demo Login{' '}
							</button>
						</li>
					</ul>
				)}
				<img
					css={[styles.dropDownMenuImage]}
					src={Hamburger}
					alt='hamburger'
					id='hamburgerMenu'
					onClick={() => setOpenMenu(!openMenu)}
				/>
			</div>
		</div>
	);
};

export default Navbar;
