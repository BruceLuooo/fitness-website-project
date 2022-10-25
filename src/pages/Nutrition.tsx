/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DailyCalorieIntake from '../components/DailyCalorieIntake';
import SearchNutritionInfo from '../components/nutrition/SearchNutritionInfo';
// import SearchRecipies from '../components/nutrition/SearchRecipies';

function Nutrition() {
	const mq1 = `@media screen and (max-width: 1283px)`;

	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			width: 100%;
			padding: 0px 100px;

			${mq1} {
				padding: 0px 0px;
			}
		`,
	};

	return (
		<div css={styles.container}>
			{/* <SearchRecipies /> */}
			<SearchNutritionInfo />
			<DailyCalorieIntake />
		</div>
	);
}

export default Nutrition;
