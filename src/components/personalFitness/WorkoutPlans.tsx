/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import { DocumentData, doc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../firebase.config';
import LoadingSpinner from '../LoadingSpinner';
import RightArrow from '../../assets/svg/rightArrow.svg';

interface SingleWorkoutPlan {
	id: string;
	index: number;
	workoutPlan: DocumentData;
}

interface Workout {
	id: string;
	data: DocumentData;
}

type Props = {
	loading: boolean;
	workoutPlans: Workout[];
	setWorkoutPlans: Function;
};

const WorkoutPlans = ({ loading, workoutPlans, setWorkoutPlans }: Props) => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		largeFont: css`
			font-size: 32px;
			font-weight: 600;
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

	const [workoutPlan, setWorkoutPlan] = useState<SingleWorkoutPlan>({
		id: '',
		index: 10000,
		workoutPlan: { inital: 'Select Workout Plan To View' },
	});

	const seeWorkoutPlan = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
		plan: Workout,
	) => {
		setWorkoutPlan({
			id: plan.id,
			index: index,
			workoutPlan: plan.data,
		});
	};

	const deleteWorkoutPlan = async (id: string) => {
		const auth = getAuth();
		const docRef = doc(
			db,
			`users/${auth.currentUser!.uid}/workout-plans/${id}`,
		);
		await deleteDoc(docRef);

		const remainingPlans = workoutPlans.filter(plan => plan.id !== id);
		setWorkoutPlans(remainingPlans);
		setWorkoutPlan({
			id: '',
			index: 10000,
			workoutPlan: { inital: 'Select Workout Plan To View' },
		});
	};

	return (
		<div css={styles.workoutPlansContainer}>
			<h1 css={styles.largeFont}>My Workout Plans</h1>
			<div css={styles.workoutPlanLayout}>
				<div css={styles.workoutPlanNameLayout}>
					{loading ? (
						<div>
							<LoadingSpinner />
						</div>
					) : (
						<div>
							{workoutPlans.length === 0 ? (
								<button css={styles.button}>
									Create your first workout plan
								</button>
							) : (
								<div>
									{workoutPlans.map((plan, index) => (
										<div
											key={index}
											css={
												workoutPlan.index === index
													? [styles.workoutPlansName, styles.selected]
													: styles.workoutPlansName
											}
											onClick={e => seeWorkoutPlan(e, index, plan)}
										>
											<div css={styles.name}>{plan.id}</div>
											<img
												css={styles.rightArrowIcon}
												src={RightArrow}
												alt='right arrow'
											/>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
				<div css={styles.exercises}>
					{Object.values(workoutPlan.workoutPlan).map((value, index) => (
						<div key={index} css={styles.workoutValue}>
							{value}
						</div>
					))}
					{workoutPlan.index !== 10000 && (
						<button
							css={[styles.button, styles.deleteButton]}
							onClick={() => deleteWorkoutPlan(workoutPlan.id)}
						>
							Delete Workout
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default WorkoutPlans;
