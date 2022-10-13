/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SearchNutritionInfo from '../components/nutrition/SearchNutritionInfo';
import SearchRecipies from '../components/nutrition/SearchRecipies';

function Nutrition() {
	const styles = {
		container: css`
			width: 100%;
			padding: 0px 100px;
		`,
	};

	return (
		<div css={styles.container}>
			<SearchRecipies />
			<SearchNutritionInfo />
		</div>
	);
}

export default Nutrition;
