/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
	setSucessfulPopup: Function;
	text: string;
}

const FormCompleted: FC<Props> = ({ setSucessfulPopup, text }) => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			min-width: 10rem;
			justify-content: center;
			${mq1} {
				width: 30rem;
			}
			${mq2} {
				width: unset;
			}
		`,
		mainContainer: css`
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		`,
		h1: css`
			font-size: 20px;
		`,
		button: css`
			height: 2rem;
			background-color: #7caafa;
			border: 1px solid #ccc;
			width: 12rem;
			height: 3rem;
			font-size: 18px;
			border-radius: 5px;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
			${mq1} {
				font-size: 16px;
			}
		`,
	};

	const resetAndNavigate = () => {
		setSucessfulPopup(false);
		token
			? navigate(`/profile/${text === 'Workout' ? 'fitness' : 'nutrition'}`)
			: navigate('/login');
	};

	return (
		<div css={styles.container}>
			{token ? (
				<div css={styles.mainContainer}>
					<p css={styles.h1}>{text} Was Added To Your Profile!</p>
					<button css={styles.button} onClick={resetAndNavigate}>
						Click To View Your {text} Log
					</button>
				</div>
			) : (
				<div css={styles.mainContainer}>
					<p css={styles.h1}>You Need To Be Signed In To Save</p>
					<button css={styles.button} onClick={resetAndNavigate}>
						Click To Sign In Or Sign Up
					</button>
				</div>
			)}
		</div>
	);
};

export default FormCompleted;
