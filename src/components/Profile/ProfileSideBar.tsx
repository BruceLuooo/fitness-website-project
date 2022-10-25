/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface props {
	currentState: string;
}

const ProfileSideBar = ({ currentState }: props) => {
	const styles = {
		container: css`
			display: flex;
			justify-content: center;
			align-items: center;
			max-width: 50rem;
			margin: auto;
		`,
		sidebarDirectory: css`
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: center;
			height: 3rem;
			background-color: white;
			border-radius: 4px;
		`,
		sidebarDirectorySelected: css`
			border: 1px solid blue;
			background-color: whitesmoke;
		`,
		button: css`
			font-size: 16px;
			width: 100%;
			height: 100%;
			border: none;
			background: none;
			&:hover {
				cursor: pointer;
			}
		`,
	};

	const navigate = useNavigate();
	const [selected, setSelected] = useState(currentState);

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
