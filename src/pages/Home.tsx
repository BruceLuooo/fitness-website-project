/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import gymPicture from '../assets/gym-picture.jpeg';
import foodPicture from '../assets/healthy-food.jpeg';
import { useNavigate } from 'react-router-dom';

function Home() {
	const navigate = useNavigate();
	const styles = {
		h1: css`
			font-size: 50px;
			text-decoration: underline;
			font-weight: bold;
			letter-spacing: 4px;
			line-height: normal;
			margin: 1rem;
		`,
		h2: css`
			font-size: 23px;
			line-height: normal;
			letter-spacing: 1px;
			margin: 1rem;
		`,
		container: css`
			width: 100%;
			padding: 0px 100px;
		`,
		video: css`
			position: relative;
			overflow: hidden;
			width: 100%;
			padding-top: 56.25%;
		`,
		iframe: css`
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			height: 80%;
			width: 100%;
		`,
		fitnessContainer: css`
			display: grid;
			grid-template-columns: 40% 60%;
			margin: 1rem 0;
			height: 30rem;
			padding: 1rem;
		`,
		nutritionContainer: css`
			display: grid;
			grid-template-columns: 60% 40%;
			margin: 1rem 0;
			height: 30rem;
			padding: 1rem;
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
			align-items: center;
			background-color: whitesmoke;
			padding: 0 1rem;
		`,
		button: css`
			border: none;
			padding: 1rem;
			margin: 1rem;
			border-radius: 30px;
			background-color: #0000001f;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #00000010;
			}
		`,
	};

	return (
		<div css={styles.container}>
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
			<div css={styles.fitnessContainer}>
				<div>
					<img src={gymPicture} alt='gym' css={styles.fitnessPicture} />
				</div>
				<div css={styles.text}>
					<h1 css={styles.h1}>The body achieves what the mind believes</h1>
					<div>
						<h2 css={styles.h2}>
							Make it eaiser for yourself by using our customizable workout plan
							tailored to you! Pick from a variety of workouts you want to
							include or let us suggest a few for you.
						</h2>
						<button css={styles.button} onClick={() => navigate('/fitness')}>
							Create a workout plan
						</button>
					</div>
				</div>
			</div>

			<div css={styles.nutritionContainer}>
				<div css={styles.text}>
					<h1 css={styles.h1}>
						If you keep good food in your fridge, you will eat good food!
					</h1>
					<div>
						<h2 css={styles.h2}>
							Let us help you keep your fridge full with our wide variety of
							recipes. There are filters to tailor to your dietary needs and
							once you're done eating, keep track of it on your personal profile{' '}
							{''}
							<a href='/login'>Here</a>
						</h2>
						<button css={styles.button} onClick={() => navigate('/nutrition')}>
							Check out Recipies
						</button>
					</div>
				</div>
				<div>
					<img src={foodPicture} alt='food' css={styles.foodPicture} />
				</div>
			</div>
		</div>
	);
}

export default Home;
