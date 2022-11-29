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
import { usePopup } from '../../hooks/usePopup';

interface Data {
	name: string;
	calories: number;
	totalNutrients: {
		FAT: {
			quantity: number;
			unit: string;
		};
		SUGAR?: {
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
	nutritionData: Data[];
}

interface LogData {
	[key: string]: any;
	loggedDate: FieldValue;
}

const DisplayNutritionalData = ({ nutritionData }: Props) => {
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		h1: css`
			font-size: 32px;
			font-weight: 600;
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
			max-width: 6em;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			height: 1.5rem;
			${mq2} {
				height: 1rem;
				font-size: 14px;
				max-width: 3rem;
			}
		`,
		displayDataContainer: css`
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			gap: 2rem;
			border: 2px solid #eeedf3;
			border-radius: 6px;
			background-color: white;
			padding: 2rem;
			max-width: 600px;
			width: 100%;
			${mq2} {
				border: none;
				padding: 1rem;
			}
		`,
		dataContainer: css`
			display: flex;
		`,
		dataStructure: css`
			display: flex;
			flex-direction: column;
			align-items: center;
			border: 1px solid black;
			gap: 2rem;
			padding: 1rem;
			${mq2} {
				padding: 0.5rem;
				max-width: 75px;
			}
		`,
		total: css`
			display: flex;
			justify-content: center;
			width: 100%;
			border-top: 2px solid black;
			padding-top: 0.5rem;
			margin-top: -1rem;
			font-size: 18px;
			${mq2} {
				font-size: 16px;
			}
		`,
		button: css`
			height: 2rem;
			background-color: #7caafa;
			color: white;
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
		popupContainer: css`
			position: relative;
		`,
		popup: css`
			position: absolute;
			left: 1rem;
			padding: 1rem;
			width: 20rem;
			background-color: whitesmoke;
			font-size: 16px;
			line-height: 1.2rem;
			z-index: 10;
			${mq2} {
				left: -20rem;
			}
		`,
	};

	let totalCalories = 0;
	let totalProtein = 0;
	let totalFat = 0;
	let totalSugar = 0;
	const { popup, setPopup } = usePopup();

	//Get total for all nutritional information
	nutritionData.forEach(data => {
		totalCalories += data.calories;
		totalFat += data.totalNutrients.FAT.quantity;
		totalProtein += data.totalNutrients.PROCNT.quantity;

		if (data.totalNutrients.SUGAR?.quantity === undefined) {
			return;
		}
		totalSugar += data.totalNutrients.SUGAR!.quantity;
	});

	const [addDataToLog, setAddDataToLog] = useState<LogData>({
		loggedDate: serverTimestamp(),
		ingredients: [],
		calories: [],
	});

	//Store data from nutritionData State into addDataToLog State
	//but adjusted in a way so that it can be stored in Firebase database
	useEffect(() => {
		if (nutritionData.length === 0) {
			return setAddDataToLog({
				loggedDate: serverTimestamp(),
				ingredients: [],
				calories: [],
			});
		}

		const formattedNutritionData = nutritionData.map(data => {
			return `${data.name}: ${Math.round(data.calories)} calories, ${Math.round(
				data.totalNutrients.PROCNT.quantity,
			)}g protein, ${Math.round(
				data.totalNutrients.FAT.quantity,
			)}g fat, ${Math.round(data.totalNutrients.SUGAR!.quantity)}g sugar`;
		});

		const calories = nutritionData.map(data => {
			return Math.round(data.calories);
		});

		setAddDataToLog({
			loggedDate: serverTimestamp(),
			ingredients: formattedNutritionData,
			calories: calories,
		});
	}, [nutritionData]);

	//Stores new data into Firebase Database
	const addToNutritionLog = async (e: React.MouseEvent<HTMLButtonElement>) => {
		const auth = getAuth();
		const docRef = collection(
			db,
			`users/${auth.currentUser!.uid}/nutrition-log`,
		);
		await addDoc(docRef, addDataToLog);
		window.location.reload();
	};

	return (
		<div css={styles.displayDataContainer}>
			<h1 css={styles.h1}>Nutrition Results</h1>

			<div css={styles.dataContainer}>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Ingridents</h2>
					{nutritionData.map(data => (
						<span css={styles.h3} key={data.name}>
							{data.name}
						</span>
					))}
					<span css={styles.total}>Total :</span>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Calories</h2>
					{nutritionData.map(data => (
						<span css={styles.h3} key={data.calories}>
							{data.calories}
						</span>
					))}
					<span css={styles.total}>{Math.round(totalCalories)}</span>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Protein</h2>
					{nutritionData.map(data => (
						<span css={styles.h3} key={data.totalNutrients.PROCNT.quantity}>
							{Math.round(data.totalNutrients.PROCNT.quantity)}
							{data.totalNutrients.PROCNT.unit}
						</span>
					))}
					<span css={styles.total}>{Math.round(totalProtein)}g</span>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Fat</h2>
					{nutritionData.map(data => (
						<span css={styles.h3} key={data.totalNutrients.FAT.quantity}>
							{Math.round(data.totalNutrients.FAT.quantity)}
							{data.totalNutrients.FAT.unit}
						</span>
					))}
					<span css={styles.total}>{Math.round(totalFat)}g</span>
				</div>
				<div css={styles.dataStructure}>
					<h2 css={styles.h2}>Sugar</h2>
					{nutritionData.map(data => (
						<span css={styles.h3} key={data.totalNutrients.SUGAR!.quantity}>
							{data.totalNutrients.SUGAR?.quantity === undefined
								? '0g'
								: Math.round(data.totalNutrients.SUGAR!.quantity)}
							{data.totalNutrients.SUGAR!.unit}
						</span>
					))}
					<span css={styles.total}>{Math.round(totalSugar)}g</span>
				</div>
			</div>
			{nutritionData.length > 0 && (
				<button css={styles.button} onClick={addToNutritionLog}>
					Add to Nutrition Log
				</button>
			)}
			<div
				css={styles.popupContainer}
				onMouseOverCapture={() => setPopup(true)}
				onMouseOutCapture={() => setPopup(false)}
			>
				<span>Missing results?</span>
				{popup && (
					<p css={styles.popup}>
						Please check your spelling. Otherwise, the missing ingredient is
						currently not in our database.
					</p>
				)}
			</div>
		</div>
	);
};

export default DisplayNutritionalData;
