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
			margin: auto;
			gap: 3rem;
			width: 100%;
			border-left: 4px solid white;
			${mq1} {
				max-width: 95%;
			}
			${mq2} {
				border-left: unset;
				padding-top: 2rem;
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
		overview: css`
			display: flex;
			height: 30rem;
			margin: auto;
			padding: 2rem 0 0 8rem;
			gap: 1.5rem;
			margin: 0 1rem;
			background-color: white;
			border-radius: 6px;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq1} {
				flex-direction: column;
				align-items: center;
				height: unset;
				padding: 1rem;
				margin: 0;
			}
			${mq2} {
				width: 100%;
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
		alignment: css`
			display: flex;
			justify-content: center;
			gap: 2rem;
			height: 14.5rem;
		`,
		workoutData: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		`,
		navigate: css`
			display: flex;
			gap: 0.3rem;
			justify-content: center;
		`,
		line: css`
			width: 4px;
			height: 95%;
			background-color: black;
			${mq1} {
				display: none;
			}
		`,
		displayCalorieLayout: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			align-items: center;
		`,
		displayCalories: css`
			font-size: 20px;
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
	// useEffect(() => {
	// 	const getWorkoutLogForTheMonth = async () => {
	// 		const auth = getAuth();

	// 		const getCollectionWorkoutLog = collection(
	// 			db,
	// 			`users/${auth.currentUser!.uid}/workout-log`,
	// 		);
	// 		const q = query(
	// 			getCollectionWorkoutLog,
	// 			where('loggedDate', '>=', currentMonthAndYear),
	// 		);
	// 		const docSnap = (await getDocs(q)).size;
	// 		setMonthlyWorkoutLog(docSnap);
	// 	};

	// 	getWorkoutLogForTheMonth();
	// }, [currentMonthAndYear]);

	// //get Nutrition Log from Firebase Database and store in monthlyCalorieIntakeLog state
	// useEffect(() => {
	// 	const getCalorieIntakeForTheMonth = async () => {
	// 		const auth = getAuth();

	// 		const getCollectionWorkoutLog = collection(
	// 			db,
	// 			`users/${auth.currentUser!.uid}/nutrition-log`,
	// 		);
	// 		const q = query(
	// 			getCollectionWorkoutLog,
	// 			where('loggedDate', '>=', currentMonthAndYear),
	// 		);
	// 		const docSnap = await getDocs(q);

	// 		const docRef: DocumentData[] = [];

	// 		docSnap.forEach(doc => {
	// 			docRef.push(doc.data().calories);
	// 		});

	// 		setMonthlyCalorieIntakeLog(docRef);
	// 	};

	// 	getCalorieIntakeForTheMonth();
	// }, [currentMonthAndYear]);

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
			<div css={styles.sideBar}>
				<ProfileSideBar currentState='overview' />
			</div>
			<div css={styles.container}>
				<div css={styles.overview}>
					<div css={styles.overviewContainer}>
						<p css={[styles.overviewLabel, styles.mediumFont]}>
							Monthly Workouts
						</p>
						<div css={styles.workoutDataContainer}>
							<ProgressBar
								completedDays={monthlyWorkoutLog}
								totalDays={workoutTarget}
							/>
							<hr css={styles.line} />
							<div css={styles.dataLayout}>
								<div css={styles.workoutData}>
									<span css={styles.largeFont}>12</span>
									<span css={styles.smallFont}>Workouts Completed</span>
								</div>
								<div css={styles.workoutData}>
									<span css={styles.largeFont}>18</span>
									<span css={styles.smallFont}>
										Workouts Completed Last Month
									</span>
								</div>
								<div css={styles.workoutData}>
									<span css={styles.largeFont}>22</span>
									<span css={styles.smallFont}>Total Workouts/Month</span>
								</div>
							</div>
						</div>
						<div css={styles.buttonLayout}>
							<button
								css={styles.button}
								onClick={() => navigate('/profile/fitness')}
							>
								Log A Workout
							</button>
							<button css={styles.button} onClick={() => setPopup(true)}>
								Set Total Workouts
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
					<hr css={styles.line} />
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
