/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import useChangePageFitnessLog from '../../hooks/personalFitness/useChangePageFitnessLog';
import AddToWorkoutLog from './AddToWorkoutLog';
import { useGetWorkoutLog } from '../../hooks/personalFitness/useGetWorkoutLog';

interface Workout {
	id: string;
	data: DocumentData;
}

type Props = {
	workoutPlans: Workout[];
};

const WorkoutLog = ({ workoutPlans }: Props) => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		workoutLogContainer: css`
			display: flex;
			gap: 2rem;
			padding: 2rem;
			margin: 0rem 1rem 1rem;
			max-width: 48rem;
			width: 100%;
			border-radius: 6px;
			background-color: white;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq1} {
				flex-direction: column;
			}
			${mq2} {
				align-items: center;
				padding: 2rem 2rem;
				width: unset;
			}
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
		logLayout: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin-bottom: 0.5rem;
			padding: 0.5rem;
			max-width: 20rem;
			border: 2px solid #eeedf3;
			border-radius: 6px;
			width: 100%;
		`,
		date: css`
			font-size: 17px;
			text-decoration: underline;
		`,
		text: css`
			font-size: 17px;
			padding-left: 0.5rem;
		`,
		buttonLayout: css`
			display: flex;
			gap: 1rem;
		`,
	};

	const {
		setWorkoutLog,
		getWorkoutLog,
		getTotalPages,
		workoutLog,
		totalPages,
	} = useGetWorkoutLog();
	const { nextPage, prevPage } = useChangePageFitnessLog();
	const [currentPage, setCurrentPage] = useState(0);
	const [rerender, setRerender] = useState(false);

	useEffect(() => {
		getWorkoutLog();
	}, [rerender]);

	useEffect(() => {
		getTotalPages();
	}, []);

	const prev = async () => {
		const results = await prevPage(currentPage - 1, 'workout-log');
		setWorkoutLog(results);
		if (currentPage <= 1) {
			setCurrentPage(0);
		} else {
			setCurrentPage(currentPage - 1);
		}
	};
	const next = async () => {
		if (currentPage > totalPages - 2) {
			return;
		}
		const results = await nextPage(currentPage, 'workout-log');
		setWorkoutLog(results);
		setCurrentPage(currentPage + 1);
	};

	return (
		<div css={styles.workoutLogContainer}>
			<AddToWorkoutLog
				rerender={rerender}
				setRerender={setRerender}
				setCurrentPage={setCurrentPage}
				workoutPlans={workoutPlans}
			/>
			{workoutLog.length === 0 ? (
				<div css={styles.logLayout}>
					<LoadingSpinner />
				</div>
			) : (
				<div>
					{workoutLog.map((log, index) => (
						<div css={styles.logLayout} key={index}>
							<div css={styles.date}>{log.loggedDate}</div>
							<p css={styles.text}>Workout Plan: {log.name}</p>
							<p css={styles.text}>Notes: {log.note}</p>
						</div>
					))}
					{workoutLog.length !== 0 && (
						<div css={styles.buttonLayout}>
							<button css={styles.button} onClick={prev}>
								Prev
							</button>
							<button css={styles.button} onClick={next}>
								Next
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default WorkoutLog;
