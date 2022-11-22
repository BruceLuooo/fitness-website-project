/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import overview from '../../assets/overview.png';
import nutrition from '../../assets/nutrition.png';
import fitness from '../../assets/fitness.png';

interface props {
	currentState: string;
}

const ProfileSideBar = ({ currentState }: props) => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		container: css`
			display: flex;
			justify-content: center;
			gap: 1rem;
			border-radius: 6px;
		`,
		sidebarDirectory: css`
			display: flex;
			justify-content: center;
			align-items: center;
			width: 25%;
			gap: 0.5rem;
			height: 3rem;
		`,
		sidebarDirectorySelected: css`
			background-color: #7caafa;
			border-radius: 6px;
			${mq2} {
				border: 2px solid #7caafa;
			}
		`,
		button: css`
			font-size: 20px;
			border: none;
			background: none;
			&:hover {
				cursor: pointer;
			}
			${mq1} {
				font-size: 18px;
			}
		`,
		icons: css`
			width: 20px;
			height: 20px;
			${mq2} {
				display: none;
			}
		`,
	};

	const navigate = useNavigate();
	let selected = currentState;

	const handleClick = (e: any) => {
		navigate(`/profile/${e.target.value}`);
	};

	return (
		<div css={styles.container}>
			<div
				css={
					selected === 'overview'
						? [styles.sidebarDirectory, styles.sidebarDirectorySelected]
						: styles.sidebarDirectory
				}
			>
				<img src={overview} alt='overview' css={styles.icons} />
				<button
					css={styles.button}
					id='overview'
					value='overview'
					onClick={handleClick}
				>
					Overview
				</button>
			</div>
			<div
				css={
					selected === 'nutrition'
						? [styles.sidebarDirectory, styles.sidebarDirectorySelected]
						: styles.sidebarDirectory
				}
			>
				<img src={nutrition} alt='nutrition' css={styles.icons} />
				<button
					css={styles.button}
					id='overview'
					value='nutrition'
					onClick={handleClick}
				>
					Nutrition
				</button>
			</div>
			<div
				css={
					selected === 'fitness'
						? [styles.sidebarDirectory, styles.sidebarDirectorySelected]
						: styles.sidebarDirectory
				}
			>
				<img src={fitness} alt='fitness' css={styles.icons} />
				<button
					css={styles.button}
					id='overview'
					value='fitness'
					onClick={handleClick}
				>
					Fitness
				</button>
			</div>
		</div>
	);
};

export default ProfileSideBar;
