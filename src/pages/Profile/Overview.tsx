/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	collection,
	query,
	where,
	getDocs,
	DocumentData,
} from 'firebase/firestore';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import ProgressBar from '../../components/Profile/ProgressBar';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import { useMonthlyCalorieTarget } from '../../hooks/useMonthlyCalorieTarget';
import { useMonthlyWorkoutTarget } from '../../hooks/useMonthlyWorkoutTarget';
import { useGetCurrentMonth } from '../../hooks/useGetCurrentMonth';
import PersonalInfo from './PersonalInfo';

const Overview = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		red: css`
			color: red;
		`,
		green: css`
			color: green;
		`,
		container: css`
			display: flex;
			flex-direction: column;
			padding-top: 4rem;
			max-width: 70rem;
			margin: auto;
			gap: 3rem;
			width: 100%;
		`,
		fontsize: css`
			display: flex;
			justify-content: center;
			font-size: 25px;
			text-decoration: underline;
		`,
		overview: css`
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			gap: 5rem;
			${mq1} {
				flex-direction: column;
				align-items: center;
			}
			${mq2} {
			}
		`,
		workoutOverviewContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: whitesmoke;
			width: 30rem;
			padding: 1.5rem;
			border-radius: 8px;
			${mq2} {
				align-items: center;
				width: unset;
			}
		`,
		navigate: css`
			display: flex;
			gap: 0.3rem;
			justify-content: center;
		`,
		nutritionOverviewContainer: css`
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: 1rem;
			background-color: whitesmoke;
			width: 30rem;
			padding: 1.5rem;
			border-radius: 8px;
			${mq2} {
				align-items: center;
				width: unset;
			}
		`,
		displayCalorieLayout: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			align-items: center;
		`,
		displayCalories: css`
			font-size: 28px;
			${mq1} {
				font-size: 24px;
			}
		`,
		button: css`
			height: 2rem;
			background-color: #7caafa;
			border: 1px solid #ccc;
			width: 8rem;
			height: 3rem;
			font-size: 16px;
			border-radius: 5px;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
		`,
		buttonLayout: css`
			display: flex;
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
	};

	const currentMonthAndYear = useGetCurrentMonth();
	const { calorieTarget } = useMonthlyCalorieTarget();
	const { workoutTarget, changeWorkoutTarget } = useMonthlyWorkoutTarget();
	const navigate = useNavigate();

	const [monthlyCalorieIntakeLog, setMonthlyCalorieIntakeLog] = useState<
		DocumentData[]
	>([]);
	const [monthlyWorkoutLog, setMonthlyWorkoutLog] = useState<number>(0);
	const [averageCalorieIntake, setAverageCalorieIntake] = useState<number>(0);
	const [popup, setPopup] = useState(false);
	const [updateWorkoutTarget, setUpdateWorkoutTarget] = useState<string>('');

	//get Workout Log from Firebase Database and store in monthlyWorkoutLog state
	useEffect(() => {
		const getWorkoutLogForTheMonth = async () => {
			const auth = getAuth();

			const getCollectionWorkoutLog = collection(
				db,
				`users/${auth.currentUser!.uid}/workout-log`,
			);
			const q = query(
				getCollectionWorkoutLog,
				where('loggedDate', '>=', currentMonthAndYear),
			);
			const docSnap = (await getDocs(q)).size;
			setMonthlyWorkoutLog(docSnap);
		};

		getWorkoutLogForTheMonth();
	});

	//get Nutrition Log from Firebase Database and store in monthlyCalorieIntakeLog state
	useEffect(() => {
		const getCalorieIntakeForTheMonth = async () => {
			const auth = getAuth();

			const getCollectionWorkoutLog = collection(
				db,
				`users/${auth.currentUser!.uid}/nutrition-log`,
			);
			const q = query(
				getCollectionWorkoutLog,
				where('loggedDate', '>=', currentMonthAndYear),
			);
			const docSnap = await getDocs(q);

			const docRef: DocumentData[] = [];

			docSnap.forEach(doc => {
				docRef.push(doc.data().calories);
			});

			setMonthlyCalorieIntakeLog(docRef);
		};

		getCalorieIntakeForTheMonth();
	});

	//Calculates average Calorie intake for the month
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

	const changeTotalWorkout = (targetWorkout: string) => {
		changeWorkoutTarget(targetWorkout);
		setPopup(false);
	};

	return (
		<div>
			<ProfileSideBar currentState='overview' />
			<div css={styles.container}>
				<div css={styles.overview}>
					<div css={styles.workoutOverviewContainer}>
						<p css={styles.fontsize}>Workouts Completed This Month</p>
						<ProgressBar
							completedDays={monthlyWorkoutLog}
							totalDays={workoutTarget}
						/>
						<div css={styles.buttonLayout}>
							<button
								css={styles.button}
								onClick={() => navigate('/profile/fitness')}
							>
								Log A Workout
							</button>
							<button css={styles.button} onClick={() => setPopup(true)}>
								Change Total Workouts
							</button>
							{popup && (
								<div css={styles.popup}>
									<input
										css={styles.popupInput}
										type='number'
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setUpdateWorkoutTarget(e.target.value)
										}
									/>
									<button
										css={[styles.button, styles.popupButton]}
										onClick={() => changeTotalWorkout(updateWorkoutTarget)}
									>
										Update
									</button>
								</div>
							)}
						</div>
					</div>
					<div css={styles.nutritionOverviewContainer}>
						<p css={styles.fontsize}>Average Calorie Intake This Month</p>
						<div css={styles.displayCalorieLayout}>
							<p
								css={
									averageCalorieIntake > calorieTarget
										? [styles.displayCalories, styles.red]
										: [styles.displayCalories, styles.green]
								}
							>
								Average Per Day : {averageCalorieIntake} Calories
							</p>
							<p css={styles.displayCalories}>
								Target Per Day: {calorieTarget} Calories
							</p>
							{averageCalorieIntake > calorieTarget && (
								<div css={styles.red}>You're Eating Too Many Calories/Day!</div>
							)}
						</div>
						<div css={styles.buttonLayout}>
							<button
								css={styles.button}
								onClick={() => navigate('/nutrition')}
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
				</div>
				<PersonalInfo />
			</div>
		</div>
	);
};

export default Overview;
