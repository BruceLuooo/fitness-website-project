/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import {
	addDoc,
	collection,
	FieldValue,
	serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase.config';

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
	setSucessfulPopup: Function;
}

interface LogData {
	[key: string]: any;
	loggedDate: FieldValue;
}

const DisplayNutritionalData = ({ dataRecieved, setSucessfulPopup }: Props) => {
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		h1: css`
			font-size: 32px;
			text-decoration: underline;
			${mq2} {
				font-size: 30px;
			}
		`,
		h2: css`
			font-size: 20px;
			font-weight: 600;
			text-decoration: underline;
			${mq2} {
				font-size: 16px;
			}
		`,
		h3: css`
			font-size: 18px;
			${mq2} {
				font-size: 14px;
			}
		`,
		displayDataContainer: css`
			display: flex;
			flex-direction: column;
			gap: 2rem;
		`,
		dataContainer: css`
			display: flex;
			gap: 2.5rem;
			padding-left: 2.5rem;
			${mq2} {
				padding-left: 0;
				gap: 1rem;
			}
		`,
		dataStructure: css`
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 2rem;
		`,
		total: css`
			display: flex;
			justify-content: center;
			width: 100%;
			border-top: 2px solid black;
			padding-top: 2rem;
			margin-top: -1rem;
			font-size: 18px;
			${mq2} {
				font-size: 16px;
			}
		`,
		button: css`
			height: 2rem;
			background-color: #7caafa;
			border: 1px solid #ccc;
			width: 10rem;
			height: 3rem;
			font-size: 16px;
			border-radius: 5px;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
		`,
	};

	let totalCalories = 0;
	let totalProtein = 0;
	let totalFat = 0;
	let totalSugar = 0;

	//Get total for all nutritional information
	dataRecieved.forEach(data => {
		totalCalories += data.calories;
		totalFat += data.totalNutrients.FAT.quantity;
		totalProtein += data.totalNutrients.PROCNT.quantity;
		totalSugar += data.totalNutrients.SUGAR.quantity;
	});

	const [addDataToLog, setAddDataToLog] = useState<LogData>({
		loggedDate: serverTimestamp(),
		ingredients: [],
		calories: [],
	});

	//Store data from dataReceived State into addDataToLog State
	//but adjusted in a way so that it can be stored in Firebase database
	useEffect(() => {
		if (dataRecieved.length === 0) {
			setAddDataToLog({
				loggedDate: serverTimestamp(),
				ingredients: [],
				calories: [],
			});
		}

		const ingredients = dataRecieved.map(data => {
			return `${data.name}: ${Math.round(data.calories)} calories, ${Math.round(
				data.totalNutrients.PROCNT.quantity,
			)}g protein, ${Math.round(
				data.totalNutrients.FAT.quantity,
			)}g fat, ${Math.round(data.totalNutrients.SUGAR.quantity)}g sugar`;
		});

		const calories = dataRecieved.map(data => {
			return Math.round(data.calories);
		});

		setAddDataToLog({
			loggedDate: serverTimestamp(),
			ingredients: ingredients,
			calories: calories,
		});
	}, [dataRecieved]);

	//Stores new data into Firebase Database
	const addToNutritionLog = async (e: React.MouseEvent<HTMLButtonElement>) => {
		try {
			const auth = getAuth();
			const docRef = collection(
				db,
				`users/${auth.currentUser!.uid}/nutrition-log`,
			);
			await addDoc(docRef, addDataToLog);
			setSucessfulPopup(true);
		} catch (error) {
			setSucessfulPopup(true);
		}
	};

	return (
		<div css={styles.displayDataContainer}>
			<h1 css={styles.h1}> Nutritional Info Results</h1>

			<div css={styles.dataContainer}>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Ingridents</h2>
					{dataRecieved.map(data => (
						<div css={styles.h3} key={data.name}>
							{data.name} :
						</div>
					))}
					<div css={styles.total}>Total :</div>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Calories</h2>
					{dataRecieved.map(data => (
						<div css={styles.h3} key={data.calories}>
							{data.calories}
						</div>
					))}
					<div css={styles.total}>{Math.round(totalCalories)}</div>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Protein</h2>
					{dataRecieved.map(data => (
						<div css={styles.h3} key={data.totalNutrients.PROCNT.quantity}>
							{Math.round(data.totalNutrients.PROCNT.quantity)}
							{data.totalNutrients.PROCNT.unit}
						</div>
					))}
					<div css={styles.total}>{Math.round(totalProtein)}g</div>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Fat</h2>
					{dataRecieved.map(data => (
						<div css={styles.h3} key={data.totalNutrients.FAT.quantity}>
							{Math.round(data.totalNutrients.FAT.quantity)}
							{data.totalNutrients.FAT.unit}
						</div>
					))}
					<div css={styles.total}>{Math.round(totalFat)}g</div>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Sugar</h2>
					{dataRecieved.map(data => (
						<div css={styles.h3} key={data.totalNutrients.SUGAR.quantity}>
							{Math.round(data.totalNutrients.SUGAR.quantity)}
							{data.totalNutrients.SUGAR.unit}
						</div>
					))}
					<div css={styles.total}>{Math.round(totalSugar)}g</div>
				</div>
			</div>
			{dataRecieved.length > 0 && (
				<button css={styles.button} onClick={addToNutritionLog}>
					Add to Nutrition Log
				</button>
			)}
		</div>
	);
};

export default DisplayNutritionalData;
