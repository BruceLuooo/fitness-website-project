/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import {
	collection,
	query,
	where,
	getDocs,
	DocumentData,
	orderBy,
} from 'firebase/firestore';
import DailyCalorieIntake from '../../components/DailyCalorieIntake';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import ProgressBar from '../../components/Profile/ProgressBar';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import { useMonthlyCalorieTarget } from '../../hooks/useMonthlyCalorieTarget';
import { useMonthlyWorkoutTarget } from '../../hooks/useMonthlyWorkoutTarget';
import { useGetCurrentMonth } from '../../hooks/useGetCurrentMonth';

const Overview = () => {
	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			gap: 3rem;
			width: 100%;
		`,
		workoutOverviewContainer: css`
			border: 1px solid black;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: aliceblue;
			width: 25rem;
			padding: 1.5rem;
		`,
		nutritionOverviewContainer: css`
			border: 1px solid black;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: aliceblue;
			width: 25rem;
			padding: 1.5rem;
		`,
	};

	const currentMonthAndYear = useGetCurrentMonth();
	const { calorieTarget, setCalorieTarget } = useMonthlyCalorieTarget();
	const { workoutTarget, setWorkoutTarget } = useMonthlyWorkoutTarget();

	const [monthlyCalorieIntakeLog, setMonthlyCalorieIntakeLog] = useState<
		DocumentData[]
	>([]);
	const [monthlyWorkoutLog, setMonthlyWorkoutLog] = useState<number>(0);
	const [averageCalorieIntake, setAverageCalorieIntake] = useState<number>(0);

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
	}, []);

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
	}, []);

	useEffect(() => {
		const getAverageCalorieIntake = () => {
			if (monthlyCalorieIntakeLog !== undefined) {
				let average = 0;

				monthlyCalorieIntakeLog.forEach(log => {
					let dailycalories = 0;
					log.forEach((daily: number) => {
						dailycalories += daily;
					});
					average += dailycalories;
				});
				setAverageCalorieIntake(average / monthlyCalorieIntakeLog.length);
			} else {
				return;
			}
		};

		getAverageCalorieIntake();
	}, [monthlyCalorieIntakeLog]);

	return (
		<div>
			<ProfileSideBar currentState='overview' />
			<div css={styles.container}>
				<DailyCalorieIntake setCalorieTarget={setCalorieTarget} />
				<div css={styles.workoutOverviewContainer}>
					<p>Monthly Workouts</p>
					{workoutTarget && calorieTarget !== 0 && (
						<div>
							<ProgressBar
								completedDays={monthlyWorkoutLog}
								totalDays={workoutTarget}
							/>
						</div>
					)}
					<p>
						Log A Workout, Click <a href='/profile/fitness'>here</a>
					</p>
				</div>
				<div css={styles.nutritionOverviewContainer}>
					<p>Average Monthly Calorie Intake : {averageCalorieIntake} </p>
					<p>{calorieTarget} calories / day </p>
					{averageCalorieIntake > calorieTarget && (
						<div>You're Eating too got damn much!!!</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Overview;
