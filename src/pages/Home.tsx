/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import gymPicture from '../assets/gym-picture.jpeg';
import foodPicture from '../assets/healthy-food.jpeg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import logo from '../assets/logo.png';

function Home() {
	const navigate = useNavigate();
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		h1: css`
			font-size: 28px;
			font-weight: bold;
			margin: 1rem;
			text-align: center;
			${mq2} {
				font-size: 18px;
			}
		`,
		h2: css`
			font-size: 18px;
			text-align: center;
			line-height: normal;
			margin: 1rem;
		`,
		container: css`
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 0px 100px;
			${mq2} {
				padding: 0 1rem;
			}
		`,
		bannerContainer: css`
			display: flex;
			justify-content: center;
			width: 100%;
			margin: 2rem 0;
		`,
		logoLine: css`
			display: flex;
			max-width: 300px;
			margin: auto;
			width: 100%;
			gap: 0.5rem;
			align-items: center;
			margin-bottom: 1rem;
			margin-top: -1.5rem;
			${mq2} {
				max-width: 200px;
			}
		`,
		logo: css`
			display: flex;
			width: 4rem;
			${mq2} {
				width: 2rem;
			}
		`,
		line: css`
			border-top: 2px solid black;
			width: 100%;
		`,

		banner: css`
			font-size: 28px;
			font-weight: bold;
			margin: 1rem;
			${mq2} {
				font-size: 17px;
			}
		`,
		mainInfoLayout: css`
			display: grid;
			grid-template-columns: 50% 50%;
			transform: translateY(-15rem);
			${mq1} {
				display: flex;
				flex-direction: column;
				transform: unset;
				gap: 2rem;
				height: 100%;
			}
		`,
		video: css`
			position: relative;
			padding-top: 56.25%;
		`,
		iframe: css`
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			height: 60%;
			width: 100%;
			${mq1} {
				height: 100%;
			}
		`,
		fitnessContainer: css`
			display: grid;
			grid-template-columns: 40% 60%;
			margin: 1rem 0;
			height: 30rem;
			padding: 1rem;
			${mq2} {
				display: flex;
				flex-direction: column;
				height: unset;
			}
		`,
		nutritionContainer: css`
			display: grid;
			grid-template-columns: 40% 60%;
			margin: 1rem 0;
			height: 30rem;
			padding: 1rem;
			${mq2} {
				display: flex;
				flex-direction: column;
				height: unset;
			}
		`,
		fitnessPicture: css`
			position: relative;
			object-fit: cover;
			width: 100%;
			height: 100%;
		`,
		foodPicture: css`
			position: relative;
			object-fit: cover;
			width: 100%;
			height: 100%;
		`,
		text: css`
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 0 1rem;
		`,
		button: css`
			border: none;
			color: white;
			padding: 1rem;
			margin: 1rem;
			border-radius: 6px;
			background-color: #353535;
			transition: 0.3s;
			cursor: pointer;
		`,
	};

	return (
		<main css={styles.container}>
			<div css={styles.bannerContainer}>
				<span css={styles.banner}>
					The place to keep track of it all - Noble Fitness
				</span>
			</div>
			<div css={styles.logoLine}>
				<hr css={styles.line} />
				<img css={styles.logo} src={logo} alt='logo' />
				<hr css={styles.line} />
			</div>
			<div css={styles.video}>
				<iframe
					css={styles.iframe}
					title='maps'
					loading='lazy'
					allowFullScreen
					referrerPolicy='no-referrer-when-downgrade'
					src={`https://www.youtube.com/embed/LEQ_ANRpWH8?autoplay=1&mute=1`}
				/>
			</div>
			<div css={styles.mainInfoLayout}>
				<div css={styles.fitnessContainer}>
					<div>
						<img src={gymPicture} alt='gym' css={styles.fitnessPicture} />
					</div>
					<div css={styles.text}>
						<h1 css={styles.h1}>The body achieves what the mind believes</h1>
						<div>
							<h2 css={styles.h2}>
								Pick from a variety of workouts and create a workout plan that
								suits you. Keep track of the total workouts you did this month
								by logging your workouts in your profile.
							</h2>
						</div>
						<button
							css={styles.button}
							onClick={() => navigate('/profile/fitness')}
						>
							Create a workout plan
						</button>
					</div>
				</div>
				<div css={styles.nutritionContainer}>
					<div>
						<img src={foodPicture} alt='food' css={styles.foodPicture} />
					</div>
					<div css={styles.text}>
						<h1 css={styles.h1}>
							Proper nutrition is a key factor to great health
						</h1>
						<div>
							<h2 css={styles.h2}>
								Use our database to find all the nutritional data from the meals
								you eat. Keep track of your meals and check to see if you meet
								your target daily calorie intake.
							</h2>
						</div>
						<button
							css={styles.button}
							onClick={() => navigate('/profile/nutrition')}
						>
							Get nutritional info
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}

export default Home;
