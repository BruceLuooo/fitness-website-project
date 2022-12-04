/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import { useGetCurrentMonth } from '../../hooks/useGetCurrentMonth';
import { useMonthlyWorkoutTarget } from '../../hooks/useMonthlyWorkoutTarget';
import ProgressBar from '../Profile/ProgressBar';

function MonthlyWorkouts() {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
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
	};

	const { getCurrentMonth, getPreviousMonthEnd, getPreviousMonthStart } =
		useGetCurrentMonth();
	const { workoutTarget, changeWorkoutTarget } = useMonthlyWorkoutTarget();
	const navigate = useNavigate();

	const [monthlyWorkoutLog, setMonthlyWorkoutLog] = useState<number>(0);
	const [prevMonthWorkoutLog, setPrevMonthWorkoutLog] = useState<number>(0);
	const [popup, setPopup] = useState(false);
	const [updateWorkoutTarget, setUpdateWorkoutTarget] = useState<string>('');

	const changeTotalWorkout = (targetWorkout: string) => {
		changeWorkoutTarget(targetWorkout);
		setPopup(false);
	};

	useEffect(() => {
		const getWorkoutLogForTheMonth = async () => {
			const auth = getAuth();

			const getCollectionWorkoutLog = collection(
				db,
				`users/${auth.currentUser!.uid}/workout-log`,
			);
			const q = query(
				getCollectionWorkoutLog,
				where('loggedDate', '>=', getCurrentMonth()),
			);
			const docSnap = (await getDocs(q)).size;
			setMonthlyWorkoutLog(docSnap);
		};

		getWorkoutLogForTheMonth();
	}, [getCurrentMonth]);
	useEffect(() => {
		const getWorkoutLogForLastMonth = async () => {
			const auth = getAuth();

			const getCollectionWorkoutLog = collection(
				db,
				`users/${auth.currentUser!.uid}/workout-log`,
			);
			const q = query(
				getCollectionWorkoutLog,
				where('loggedDate', '>', getPreviousMonthStart()),
				where('loggedDate', '<', getPreviousMonthEnd()),
			);
			const docSnap = (await getDocs(q)).size;
			setPrevMonthWorkoutLog(docSnap);
		};

		getWorkoutLogForLastMonth();
	}, []);

	return (
		<div css={styles.overviewContainer}>
			<p css={[styles.overviewLabel, styles.mediumFont]}>Monthly Workouts</p>
			<div css={styles.workoutDataContainer}>
				<ProgressBar
					completedDays={monthlyWorkoutLog}
					totalDays={workoutTarget}
				/>
				<hr css={styles.line} />
				<div css={styles.dataLayout}>
					<div css={styles.workoutData}>
						<span css={styles.largeFont}>{monthlyWorkoutLog}</span>
						<span css={styles.smallFont}>Workouts Completed This Month</span>
					</div>
					<div css={styles.workoutData}>
						<span css={styles.largeFont}>{prevMonthWorkoutLog}</span>
						<span css={styles.smallFont}>Workouts Completed Last Month</span>
					</div>
					<div css={styles.workoutData}>
						<span css={styles.largeFont}>{workoutTarget}</span>
						<span css={styles.smallFont}>Target Workouts/Month</span>
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
	);
}

export default MonthlyWorkouts;
