/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import logo from '../assets/Trifecta-Logo.jpeg';
import React from 'react';

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
						<li>
							<a css={styles.navigationItems} href='/login'>
								Login
							</a>
						</li>
						<li>
							<a css={styles.navigationItems} href='/profile/overview'>
								Profile
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
