/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

interface Data {
	name: string;
	calories: number;
	totalNutrients: {
		FAT: {
			quantity: number;
			unit: string;
		};
		SUGAR: {
			quantity: number;
			unit: string;
		};
		PROCNT: {
			quantity: number;
			unit: string;
		};
	};
}

type Props = {
	data: Data[];
};

const DisplayNutritionalData = ({ data }: Props) => {
	const styles = {
		h1: css`
			font-size: 32px;
		`,
		h2: css`
			font-size: 20px;
		`,
		displayDataContainer: css`
			background-color: aqua;
			padding: 1rem 2rem;
			display: flex;
			flex-direction: column;
			gap: 2rem;
		`,
		dataContainer: css`
			display: flex;
			gap: 2.5rem;
		`,
		dataStructure: css`
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 2rem;
		`,
	};

	let totalCalories = 0;
	let totalProtein = 0;
	let totalFat = 0;
	let totalSugar = 0;

	data.forEach(data => {
		totalCalories += data.calories;
		totalFat += data.totalNutrients.FAT.quantity;
		totalProtein += data.totalNutrients.PROCNT.quantity;
		totalSugar += data.totalNutrients.SUGAR.quantity;
	});

	return (
		<div css={styles.displayDataContainer}>
			<h1 css={styles.h1}> Nutritional Info Results</h1>

			<div css={styles.dataContainer}>
				<div css={styles.dataStructure}>
					<div>Food</div>
					{data.map(data => (
						<div key={data.name}>{data.name}</div>
					))}
					<div>Total</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Calories</div>
					{data.map(data => (
						<div key={data.calories}>{data.calories}</div>
					))}
					<div>{Math.round(totalCalories)}</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Protein</div>
					{data.map(data => (
						<div key={data.totalNutrients.PROCNT.quantity}>
							{Math.round(data.totalNutrients.PROCNT.quantity)}
							{data.totalNutrients.PROCNT.unit}
						</div>
					))}
					<div>{Math.round(totalProtein)}g</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Fat</div>
					{data.map(data => (
						<div key={data.totalNutrients.FAT.quantity}>
							{Math.round(data.totalNutrients.FAT.quantity)}
							{data.totalNutrients.FAT.unit}
						</div>
					))}
					<div>{Math.round(totalFat)}g</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Sugar</div>
					{data.map(data => (
						<div key={data.totalNutrients.SUGAR.quantity}>
							{Math.round(data.totalNutrients.SUGAR.quantity)}
							{data.totalNutrients.SUGAR.unit}
						</div>
					))}
					<div>{Math.round(totalSugar)}g</div>
				</div>
			</div>
		</div>
	);
};

export default DisplayNutritionalData;
