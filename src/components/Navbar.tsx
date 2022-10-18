/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import logo from '../assets/Trifecta-Logo.jpeg';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const Navbar = () => {
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
		`,
		navbar: css`
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
	};

	const navigate = useNavigate();
	const auth = getAuth();
	const token = localStorage.getItem('token');

	const logout = (e: React.MouseEvent<HTMLButtonElement>) => {
		auth.signOut();
		localStorage.removeItem('token');
		navigate('/');
	};

	return (
		<div css={styles.container}>
			<div css={styles.navbarContainer}>
				<a href='/' css={styles.logo}>
					<div css={styles.navbar}>
						<img src={logo} css={styles.logoImage} alt='logo' />
						<div css={styles.logoFont}>NoBull Fitness</div>
					</div>
				</a>
				<div>
					<ul css={styles.navbar}>
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
						{!token && (
							<li>
								<a css={styles.navigationItems} href='/login'>
									Login
								</a>
							</li>
						)}
						{token && (
							<div>
								<li>
									<a css={styles.navigationItems} href='/profile/overview'>
										Profile
									</a>
								</li>
								<li>
									<button css={styles.navigationItems} onClick={logout}>
										Logout
									</button>
								</li>
							</div>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
