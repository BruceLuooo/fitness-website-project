/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import { useEffect, useState } from 'react';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import useDelay from '../../hooks/useDelay';
import SearchExercises from '../../components/fitness/SearchExercises';
import WorkoutLog from '../../components/personalFitness/WorkoutLog';
import WorkoutPlans from '../../components/personalFitness/WorkoutPlans';

interface Workout {
	id: string;
	data: DocumentData;
}

const PersonalFitness = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		largeFont: css`
			font-size: 32px;
			font-weight: 600;
		`,
		mainContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
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
			width: 100%;
			margin: auto;
			gap: 3rem;
			border-left: 4px solid white;
			${mq1} {
				max-width: 100%;
				padding-top: 1rem;
			}
		`,
		firstHalfLayout: css`
			display: flex;
			width: 100%;
			${mq2} {
				flex-direction: column;
			}
		`,
		workoutPlansContainer: css`
			display: flex;
			flex-direction: column;
			justify-content: center;
			max-width: 48rem;
			width: 100%;
			gap: 1rem;
			margin: 0rem 1rem 1rem;
			padding: 2rem 2rem;
			background-color: white;
			border-radius: 6px;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq2} {
				align-items: center;
				width: unset;
			}
		`,
		workoutPlanLayout: css`
			display: flex;
			gap: 2rem;
			max-width: 40rem;
			width: 100%;
			${mq1} {
				flex-direction: column;
			}
		`,
		workoutPlanNameLayout: css`
			display: flex;
			flex-direction: column;
			max-height: 20rem;
			overflow-y: scroll;
			gap: 0.5rem;
			${mq1} {
				max-height: 24rem;
				overflow-y: scroll;
				height: 8rem;
			}
		`,
		workoutPlansName: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 4rem;
			border: 1px solid #ccc;
			padding: 0 2rem;
			border-radius: 5px;
			width: 16rem;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
			${mq1} {
				padding: 0 0.5rem;
			}
		`,
		selected: css`
			background-color: #4f8efb;
			color: white;
		`,
		exercises: css`
			display: flex;
			flex-direction: column;
			padding: 1rem;
			max-width: 20rem;
			width: 100%;
			border: 2px solid #eeedf3;
			border-radius: 6px;
			gap: 1rem;
			${mq1} {
				min-width: 20rem;
			}
			${mq2} {
				min-width: 10rem;
			}
		`,
		name: css`
			font-size: 18px;
			${mq1} {
				font-size: 16px;
			}
		`,
		rightArrowIcon: css`
			width: 18px;
		`,
		button: css`
			height: 2rem;
			background-color: #7caafa;
			color: white;
			border: none;
			width: 6rem;
			height: 2.5rem;
			font-size: 14px;
			border-radius: 5px;
			transition: 0.3s;
			box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
		`,
		deleteButton: css`
			margin-top: 3rem;
			background-color: #ff8181;
			&:hover {
				background-color: red;
			}
			${mq2} {
				width: 5rem;
				padding: 0 0.5rem;
			}
		`,
		workoutValue: css`
			font-size: 16px;
		`,
	};

	const { loading, setLoading, delay } = useDelay();
	const [workoutPlans, setWorkoutPlans] = useState<Workout[]>([]);

	useEffect(() => {
		setLoading(true);
		const auth = getAuth();
		const getWorkoutPlans = async () => {
			const test = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'workout-plans',
			);

			const docSnap = await getDocs(test);
			const data: Workout[] = [];

			docSnap.forEach(doc => {
				return data.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setWorkoutPlans(data);
			await delay(1000);
			setLoading(false);
		};

		getWorkoutPlans();
	}, []);

	return (
		<div css={styles.mainContainer}>
			<div css={styles.sideBar}>
				<ProfileSideBar currentState='fitness' />
			</div>
			<div css={styles.container}>
				<div css={styles.firstHalfLayout}>
					<WorkoutLog workoutPlans={workoutPlans} />
					<WorkoutPlans
						loading={loading}
						workoutPlans={workoutPlans}
						setWorkoutPlans={setWorkoutPlans}
					/>
				</div>
				<SearchExercises />
			</div>
		</div>
	);
};

export default PersonalFitness;
