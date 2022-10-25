/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import logo from '../assets/Trifecta-Logo.jpeg';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
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
			padding: 15px 100px;
			${mq1} {
				padding: 15px 25px;
			}
		`,
		logo: css`
			text-decoration: none;
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
			&:hover {
				opacity: 70%;
				text-shadow: 1px;
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
		dropDownMenu: css`
			display: none;
			${mq1} {
				display: block;
			}
		`,
		DropdownMenuView: css`
			${mq1} {
				display: contents;
				position: absolute;
				top: 4rem;
				padding-top: 2rem;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				align-items: center;
				gap: 2rem;
				width: 100vw;
				height: 100vh;
				background-color: whitesmoke;
				font-size: 40px;
			}
		`,
	};

	const navigate = useNavigate();
	const auth = getAuth();
	const token = localStorage.getItem('token');
	const [openMenu, setOpenMenu] = useState<Boolean>(false);

	const logout = () => {
		auth.signOut();
		localStorage.removeItem('token');
		navigate('/');
		setOpenMenu(false);
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
				<ul css={[styles.navbar, openMenu && styles.DropdownMenuView]}>
					<li>
						<a css={styles.navigationItems} href='/'>
							Home
						</a>
					</li>
					<li>
						<a css={styles.navigationItems} href='/fitness'>
							Fitness
						</a>
					</li>
					<li>
						<a css={styles.navigationItems} href='/nutrition'>
							Nutrition
						</a>
					</li>
					{token && (
						<li>
							<a css={styles.navigationItems} href='/profile/overview'>
								Profile
							</a>
						</li>
					)}
					{token ? (
						<li>
							<div
								css={[styles.navigationItems, styles.logout]}
								onClick={logout}
							>
								Logout
							</div>
						</li>
					) : (
						<li>
							<a css={styles.navigationItems} href='/login'>
								Login
							</a>
						</li>
					)}
				</ul>
				<img
					css={[styles.dropDownMenu]}
					src={Hamburger}
					alt='hamburger'
					onClick={() => setOpenMenu(!openMenu)}
				/>
			</div>
		</div>
	);
};

export default Navbar;
