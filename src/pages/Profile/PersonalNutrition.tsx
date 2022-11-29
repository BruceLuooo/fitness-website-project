/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DailyCalorieIntake from '../../components/personalNutrition/DailyCalorieIntake';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import SearchNutritionInfo from '../../components/nutrition/SearchNutritionInfo';
import NutritionLog from '../../components/personalNutrition/NutritionLog';

const PersonalNutrition = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		mainContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
		`,
		sideBar: css`
			max-width: 800px;
			width: 100%;
			margin: auto;
		`,
		container: css`
			display: flex;
			flex-direction: column;
			padding-top: 4rem;
			max-width: 80%;
			width: 100%;
			margin: auto;
			gap: 3rem;
			border-left: 4px solid white;
			${mq1} {
				max-width: 100%;
				padding-top: 1rem;
			}
		`,
		bottomHalfLayout: css`
			display: flex;
			width: 100%;
			${mq2} {
				flex-direction: column;
			}
		`,
	};

	return (
		<div css={styles.mainContainer}>
			<div css={styles.sideBar}>
				<ProfileSideBar currentState='nutrition' />
			</div>
			<div css={styles.container}>
				<SearchNutritionInfo />
				<div css={styles.bottomHalfLayout}>
					<NutritionLog />
					<DailyCalorieIntake />
				</div>
			</div>
		</div>
	);
};

export default PersonalNutrition;
