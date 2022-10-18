/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import {
	addDoc,
	collection,
	doc,
	FieldValue,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { useError } from '../../hooks/useError';

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

interface Props {
	dataRecieved: Data[];
}

interface LogData {
	[key: string]: any;
	loggedDate: FieldValue;
}

const DisplayNutritionalData = ({ dataRecieved }: Props) => {
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

	dataRecieved.forEach(data => {
		totalCalories += data.calories;
		totalFat += data.totalNutrients.FAT.quantity;
		totalProtein += data.totalNutrients.PROCNT.quantity;
		totalSugar += data.totalNutrients.SUGAR.quantity;
	});

	const { error, setError } = useError();

	const [addDataToLog, setAddDataToLog] = useState<LogData>({
		loggedDate: serverTimestamp(),
		ingredients: [],
	});

	useEffect(() => {
		dataRecieved.map(data => {
			setAddDataToLog(prev => ({
				...prev,
				ingredients: [
					...prev.ingredients,
					`${data.name}: ${Math.round(data.calories)} calories, ${Math.round(
						data.totalNutrients.PROCNT.quantity,
					)}g protein, ${Math.round(
						data.totalNutrients.FAT.quantity,
					)}g fat, ${Math.round(data.totalNutrients.SUGAR.quantity)}g sugar`,
				],
			}));
		});
	}, [dataRecieved]);

	const addToNutritionLog = async (e: React.MouseEvent<HTMLButtonElement>) => {
		try {
			const auth = getAuth();
			const docRef = collection(
				db,
				`users/${auth.currentUser!.uid}/nutrition-log`,
			);
			await addDoc(docRef, addDataToLog);
			setError({ active: false, message: '' });
		} catch (error) {
			setError({
				active: true,
				message: 'Please give your workout plan a name ',
			});
		}
	};

	return (
		<div css={styles.displayDataContainer}>
			<h1 css={styles.h1}> Nutritional Info Results</h1>

			<div css={styles.dataContainer}>
				<div css={styles.dataStructure}>
					<div>Food</div>
					{dataRecieved.map(data => (
						<div key={data.name}>{data.name}</div>
					))}
					<div>Total</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Calories</div>
					{dataRecieved.map(data => (
						<div key={data.calories}>{data.calories}</div>
					))}
					<div>{Math.round(totalCalories)}</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Protein</div>
					{dataRecieved.map(data => (
						<div key={data.totalNutrients.PROCNT.quantity}>
							{Math.round(data.totalNutrients.PROCNT.quantity)}
							{data.totalNutrients.PROCNT.unit}
						</div>
					))}
					<div>{Math.round(totalProtein)}g</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Fat</div>
					{dataRecieved.map(data => (
						<div key={data.totalNutrients.FAT.quantity}>
							{Math.round(data.totalNutrients.FAT.quantity)}
							{data.totalNutrients.FAT.unit}
						</div>
					))}
					<div>{Math.round(totalFat)}g</div>
				</div>
				<div css={styles.dataStructure}>
					<div>Sugar</div>
					{dataRecieved.map(data => (
						<div key={data.totalNutrients.SUGAR.quantity}>
							{Math.round(data.totalNutrients.SUGAR.quantity)}
							{data.totalNutrients.SUGAR.unit}
						</div>
					))}
					<div>{Math.round(totalSugar)}g</div>
				</div>
				<button onClick={addToNutritionLog}>Add to Nutrition Log</button>
			</div>
		</div>
	);
};

export default DisplayNutritionalData;
