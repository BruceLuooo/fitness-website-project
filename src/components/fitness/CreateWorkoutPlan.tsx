/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import { useError } from '../../hooks/useError';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import trash from '../../assets/svg/trash.svg';
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
			min-width: 10rem;
			flex-direction: column;
			gap: 1rem;
			${mq1} {
				width: 30rem;
			}
			${mq2} {
				width: unset;
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
			font-size: 18px;
		`,
		input: css`
			height: 1.8rem;
			font-size: 16px;
			padding: 16px 6px;
			border: 1px solid #ccc;
			border-radius: 5px;
			width: 20rem;
			${mq2} {
				width: unset;
			}
		`,
		exercise: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 3rem;
			margin-bottom: 1rem;
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
		`,
		moveUpOrDown: css`
			display: flex;
			flex-direction: column;
			gap: 5px;
		`,
		submitButton: css`
			height: 2rem;
			background-color: #7caafa;
			border: 1px solid #ccc;
			width: 10rem;
			height: 3rem;
			font-size: 18px;
			border-radius: 5px;
			transition: 0.3s;
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
	};

	//Reorder workout from workoutPlan State
	const reorder = (e: any, data: data) => {
		const newIndex =
			workoutPlan.map(workout => workout.name).indexOf(data.name) +
			(e.target.id === 'up' ? -1 : 1);

		if (newIndex < 0 || newIndex > workoutPlan.length) {
			return;
		}

		const newArray = workoutPlan.filter(
			workout => workout.index !== data.index,
		);

		newArray.splice(newIndex, 0, data);
		setWorkoutPlan(newArray);
	};

	//Updates the reps and sets fields in a selected workout found in workoutPlan State
	const onChange = (e: any, index: number) => {
		let clone = [...workoutPlan];
		let obj = clone[index];

		if (e.target.id === 'reps') {
			obj.reps = e.target.value;
			clone[index] = obj;
			setWorkoutPlan([...clone]);
		} else {
			obj.sets = e.target.value;
			clone[index] = obj;
			setWorkoutPlan([...clone]);
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
			setSucessfulPopup(true);
		} catch (error) {
			setSucessfulPopup(true);
		}
	};

	return (
		<div css={styles.container}>
			{workoutPlan.length !== 0 && (
				<div css={styles.workoutPlanName}>
					<label css={styles.label} htmlFor=''>
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
			<div>
				{workoutPlan.map((currentWorkout, index) => (
					<div css={styles.exercise} key={index}>
						<div css={styles.title}>
							<img
								src={trash}
								css={styles.svgButton}
								alt='remove'
								onClick={e => removeWorkout(e, currentWorkout.index)}
							/>
							<p css={styles.label}>{currentWorkout.name}</p>
						</div>
						<div css={styles.title}>
							<div css={styles.title}>
								<input
									css={styles.valueInput}
									type='text'
									id='reps'
									placeholder='Reps'
									onChange={e => onChange(e, index)}
								/>
								<input
									css={styles.valueInput}
									type='text'
									id='sets'
									placeholder='Sets'
									onChange={e => onChange(e, index)}
								/>
							</div>
							<div css={styles.moveUpOrDown}>
								<img
									src={moveUp}
									alt='up'
									css={styles.svgButton}
									id='up'
									onClick={e => reorder(e, currentWorkout)}
								/>
								<img
									src={moveDown}
									alt='down'
									css={styles.svgButton}
									id='down'
									onClick={e => reorder(e, currentWorkout)}
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
