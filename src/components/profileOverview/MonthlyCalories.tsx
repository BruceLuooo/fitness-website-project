/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import {
	collection,
	DocumentData,
	getDocs,
	query,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import { useGetCurrentMonth } from '../../hooks/useGetCurrentMonth';
import { useMonthlyCalorieTarget } from '../../hooks/useMonthlyCalorieTarget';

function MonthlyCalories() {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		red: css`
			color: red;
		`,
		green: css`
			color: green;
		`,
		largeFont: css`
			font-size: 28px;
			font-weight: 600;
			${mq2} {
				font-size: 24px;
			}
		`,
		mediumFont: css`
			font-size: 24px;
		`,
		smallFont: css`
			font-size: 16px;
			color: gray;
			${mq2} {
				font-size: 14px;
			}
		`,
		overviewLabel: css`
			display: flex;
			justify-content: flex-start;
			font-weight: 600;
			${mq1} {
				text-decoration: underline;
				text-underline-offset: 6px;
			}
		`,
		overviewContainer: css`
			display: flex;
			flex-direction: column;
			gap: 2.5rem;
			max-width: 45rem;
			padding: 1rem 0 0 1rem;
			width: 100%;
			${mq1} {
				align-items: flex-start;
				border: 2px solid black;
				padding-bottom: 1rem;
				border-radius: 6px;
			}
		`,
		workoutDataContainer: css`
			display: flex;
			align-items: center;
			gap: 1.5rem;
		`,
		dataLayout: css`
			display: flex;
			flex-direction: column;
			gap: 2rem;
		`,
		workoutData: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		`,
		line: css`
			width: 4px;
			height: 95%;
			background-color: black;
			${mq1} {
				display: none;
			}
		`,
		button: css`
			background-color: #7caafa;
			color: white;
			border: none;
			width: 8rem;
			height: 3rem;
			font-size: 16px;
			border-radius: 5px;
			transition: 0.3s;
			box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
		`,
		buttonLayout: css`
			display: flex;
			justify-content: flex-start;
			align-items: center;
			gap: 1rem;
		`,
		popup: css`
			display: flex;
			align-items: center;
			gap: 0.5rem;
		`,
		popupInput: css`
			width: 3rem;
			height: 2rem;
		`,
		popupButton: css`
			width: 4rem;
			height: 2rem;
		`,
		alignment: css`
			display: flex;
			justify-content: center;
			gap: 2rem;
			height: 14.5rem;
		`,
	};

	const { calorieTarget } = useMonthlyCalorieTarget();
	const { getCurrentMonth } = useGetCurrentMonth();
	const navigate = useNavigate();
	const [averageCalorieIntake, setAverageCalorieIntake] = useState<number>(0);
	const [monthlyCalorieIntakeLog, setMonthlyCalorieIntakeLog] = useState<
		DocumentData[]
	>([]);

	useEffect(() => {
		const getAverageCalorieIntake = () => {
			if (monthlyCalorieIntakeLog.length !== 0) {
				let average = 0;

				monthlyCalorieIntakeLog.forEach(log => {
					let dailycalories = 0;
					log.forEach((daily: number) => {
						dailycalories += daily;
					});
					average += dailycalories;
				});

				setAverageCalorieIntake(
					Math.round(average / monthlyCalorieIntakeLog.length),
				);
			} else {
				setAverageCalorieIntake(0);
			}
		};

		getAverageCalorieIntake();
	}, [monthlyCalorieIntakeLog]);

	useEffect(() => {
		const getCalorieIntakeForTheMonth = async () => {
			const auth = getAuth();

			const getCollectionWorkoutLog = collection(
				db,
				`users/${auth.currentUser!.uid}/nutrition-log`,
			);
			const q = query(
				getCollectionWorkoutLog,
				where('loggedDate', '>=', getCurrentMonth()),
			);
			const docSnap = await getDocs(q);

			const docRef: DocumentData[] = [];

			docSnap.forEach(doc => {
				docRef.push(doc.data().calories);
			});

			setMonthlyCalorieIntakeLog(docRef);
		};

		getCalorieIntakeForTheMonth();
	}, []);

	return (
		<div css={styles.overviewContainer}>
			<p css={[styles.overviewLabel, styles.mediumFont]}>
				Monthly Calorie Intake
			</p>

			<div css={[styles.dataLayout, styles.alignment]}>
				<div css={styles.workoutData}>
					<span
						css={
							averageCalorieIntake > calorieTarget
								? [styles.largeFont, styles.red]
								: [styles.largeFont, styles.green]
						}
					>
						{averageCalorieIntake} Calories
					</span>
					<span css={styles.smallFont}>Average Calories/Day</span>
				</div>
				<div css={styles.workoutData}>
					<span css={styles.largeFont}>{calorieTarget} Calories</span>
					<span css={styles.smallFont}>Target Calories/Day</span>
				</div>
				{averageCalorieIntake > calorieTarget && (
					<div css={styles.red}>You're Eating Too Many Calories/Day!</div>
				)}
			</div>
			<div css={styles.buttonLayout}>
				<button
					css={styles.button}
					onClick={() => navigate('/profile/nutrition')}
				>
					Log Nutrition
				</button>
				<button
					css={styles.button}
					onClick={() => navigate('/profile/nutrition')}
				>
					Change Daily Calorie Intake
				</button>
			</div>
		</div>
	);
}

export default MonthlyCalories;
