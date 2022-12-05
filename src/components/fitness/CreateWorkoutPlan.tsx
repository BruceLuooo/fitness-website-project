/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import { useError } from '../../hooks/useError';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import redx from '../../assets/redx.png';
import moveUp from '../../assets/svg/moveUp.svg';
import moveDown from '../../assets/moveDown.png';

interface data {
	name: string;
	index: number;
	reps: number;
	sets: number;
}

interface Props {
	workoutPlan: data[];
	setWorkoutPlan: Function;
	setSucessfulPopup: Function;
}

interface Workoutplan {
	[key: string]: any;
}

const CreateWorkoutPlan: FC<Props> = ({
	workoutPlan,
	setWorkoutPlan,
	setSucessfulPopup,
}) => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		red: css`
			color: red;
		`,
		container: css`
			display: flex;

			height: 40rem;
			flex-direction: column;
			${mq1} {
				max-width: 30rem;
			}
			${mq2} {
				width: unset;
				height: 30rem;
			}
		`,
		svgButton: css`
			width: 18px;
			&:hover {
				cursor: pointer;
			}
		`,
		workoutPlanName: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin: 0.7rem 0;
		`,
		label: css`
			font-size: 17px;
		`,
		input: css`
			height: 1.8rem;
			font-size: 16px;
			padding: 16px 6px;
			border: 1px solid #ccc;
			border-radius: 5px;
			max-width: 20rem;
			width: 100%;
			${mq2} {
				width: unset;
			}
		`,
		workoutListContainer: css`
			max-height: 19rem;
			overflow-y: auto;
			width: 100%;
		`,
		exercise: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 3rem;
			margin-bottom: 1rem;
			max-width: 25rem;
			width: 100%;
			${mq2} {
				flex-direction: column;
				gap: 1rem;
				align-items: unset;
			}
		`,
		title: css`
			display: flex;
			align-items: center;
			gap: 0.5rem;
		`,
		valueInput: css`
			width: 3rem;
			height: 1.5rem;
			text-align: center;
			${mq2} {
				height: 2rem;
			}
		`,
		moveUpOrDown: css`
			display: flex;
			flex-direction: column;
			gap: 5px;
		`,
		submitButton: css`
			background-color: #7caafa;
			border: 1px solid #ccc;
			color: white;
			width: 10rem;
			height: 4rem;
			font-size: 16px;
			border-radius: 5px;
			transition: 0.3s;
			margin-top: 1rem;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
		`,
	};

	const { error, setError } = useError();
	const [newWorkoutPlan, setNewWorkoutPlan] = useState<Workoutplan>({});
	const [newWorkoutPlanName, setNewWorkoutPlanName] = useState('');

	//data from workoutPlan state gets stored into NewWorkoutPlan State
	//but adjusted in a way so that it can be stored in Firebase database
	useEffect(() => {
		setNewWorkoutPlan({});
		workoutPlan.forEach(workout => {
			setNewWorkoutPlan(prev => ({
				...prev,
				[workout.name]: `${workout.name} : ${workout.reps} reps x ${workout.sets} sets`,
			}));
		});
	}, [workoutPlan]);

	//Remove workout from workoutPlan State
	const removeWorkout = (
		e: React.MouseEvent<HTMLImageElement>,
		index: number,
	) => {
		const remove = workoutPlan.filter(workout => workout.index !== index);

		setWorkoutPlan(remove);
		setError({ active: false, message: '' });
	};

	const isAbleToReorder = (newIndex: number, workoutPlan: data[]) => {
		return newIndex < 0 || newIndex > workoutPlan.length;
	};

	const reorderWorkoutPlan = (e: any, data: data) => {
		const newIndex =
			workoutPlan.map(workout => workout.name).indexOf(data.name) +
			(e.target.id === 'up' ? -1 : 1);

		if (isAbleToReorder(newIndex, workoutPlan)) {
			return;
		}

		const newArray = workoutPlan.filter(
			workout => workout.index !== data.index,
		);

		newArray.splice(newIndex, 0, data);
		setWorkoutPlan(newArray);
	};

	//Updates the reps and sets fields in a selected workout found in workoutPlan State
	const updateRepsAndSets = (e: any, index: number) => {
		let workoutPlanCopy = [...workoutPlan];
		let selectedWorkout = workoutPlanCopy[index];

		if (e.target.id === 'reps') {
			selectedWorkout.reps = e.target.value;
			workoutPlanCopy[index] = selectedWorkout;
			setWorkoutPlan([...workoutPlanCopy]);
		} else {
			selectedWorkout.sets = e.target.value;
			workoutPlanCopy[index] = selectedWorkout;
			setWorkoutPlan([...workoutPlanCopy]);
		}
	};

	//Sets the ID of the workoutplan that would be found in Firebase Database
	const addWorkoutPlanName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewWorkoutPlanName(e.target.value);
	};

	//Stores new workout into Firebase Database
	const submitNewWorkoutPlan = async (
		e: React.MouseEvent<HTMLButtonElement>,
	) => {
		e.preventDefault();

		if (newWorkoutPlanName === '') {
			return setError({
				active: true,
				message: 'Please give your workout plan a name ',
			});
		}

		try {
			const auth = getAuth();
			const docRef = doc(
				db,
				`users/${auth.currentUser!.uid}/workout-plans`,
				`${newWorkoutPlanName}`,
			);
			await setDoc(docRef, newWorkoutPlan);
			setError({ active: false, message: '' });
			window.location.reload();
		} catch (error) {
			setError({
				active: true,
				message: 'Please Remove / from workout plan name ',
			});
		}
	};

	return (
		<div css={styles.container}>
			<span>Step 3: Add workout plan to Profile</span>
			{workoutPlan.length !== 0 && (
				<div css={styles.workoutPlanName}>
					<label css={styles.label} htmlFor='name'>
						Name Workout Plan
					</label>
					<input
						css={styles.input}
						type='text'
						onChange={addWorkoutPlanName}
						id='name'
					/>
				</div>
			)}
			<div css={styles.workoutListContainer}>
				{workoutPlan.map((currentWorkout, index) => (
					<div css={styles.exercise} key={index}>
						<div css={styles.title}>
							<img
								src={redx}
								css={styles.svgButton}
								alt='remove'
								onClick={e => removeWorkout(e, currentWorkout.index)}
							/>
							<span css={styles.label}>{currentWorkout.name}</span>
						</div>
						<div css={styles.title}>
							<div css={styles.title}>
								<input
									css={styles.valueInput}
									type='text'
									id='reps'
									placeholder='Reps'
									onChange={e => updateRepsAndSets(e, index)}
								/>
								<input
									css={styles.valueInput}
									type='text'
									id='sets'
									placeholder='Sets'
									onChange={e => updateRepsAndSets(e, index)}
								/>
							</div>
							<div css={styles.moveUpOrDown}>
								<img
									src={moveUp}
									alt='up'
									css={styles.svgButton}
									id='up'
									onClick={e => reorderWorkoutPlan(e, currentWorkout)}
								/>
								<img
									src={moveDown}
									alt='down'
									css={styles.svgButton}
									id='down'
									onClick={e => reorderWorkoutPlan(e, currentWorkout)}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
			{error && <div css={styles.red}>{error.message}</div>}
			{workoutPlan.length > 0 && (
				<button
					css={styles.submitButton}
					type='button'
					onClick={submitNewWorkoutPlan}
				>
					Add Workout Plan To Profile
				</button>
			)}
		</div>
	);
};

export default CreateWorkoutPlan;
