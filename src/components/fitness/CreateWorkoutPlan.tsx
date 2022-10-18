/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import { useError } from '../../hooks/useError';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import remove from '../../assets/svg/red-x-icon.svg';

interface data {
	name: string;
	index: number;
	reps: number;
	sets: number;
}

interface Props {
	workoutPlan: data[];
	setWorkoutPlan: Function;
}

interface Workoutplan {
	[key: string]: any;
}

const CreateWorkoutPlan: FC<Props> = ({ workoutPlan, setWorkoutPlan }) => {
	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: aliceblue;
			gap: 2rem;
		`,
		removeButton: css`
			width: 24px;
		`,
	};

	const { error, setError } = useError();
	const [newWorkoutPlan, setNewWorkoutPlan] = useState<Workoutplan>({});
	const [newWorkoutPlanName, setNewWorkoutPlanName] = useState('');

	useEffect(() => {
		workoutPlan.forEach(workout => {
			setNewWorkoutPlan(prev => ({
				...prev,
				[workout.name]: `${workout.name} : ${workout.reps} reps x ${workout.sets} sets`,
			}));
		});
	}, [workoutPlan]);

	const removeWorkout = (
		e: React.MouseEvent<HTMLImageElement>,
		index: number,
	) => {
		const remove = workoutPlan.filter(workout => workout.index !== index);

		setWorkoutPlan(remove);
	};

	const reorder = (e: any, data: data) => {
		const newIndex =
			workoutPlan.map(workout => workout.name).indexOf(data.name) +
			(e.target.id === 'up' ? -1 : 1);

		console.log(newIndex);

		if (newIndex < 0 || newIndex > workoutPlan.length) {
			return;
		}

		const newArray = workoutPlan.filter(
			workout => workout.index !== data.index,
		);

		newArray.splice(newIndex, 0, data);
		setWorkoutPlan(newArray);
	};

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

	const addWorkoutPlanName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewWorkoutPlanName(e.target.value);
	};

	const submitNewWorkoutPlan = async (
		e: React.MouseEvent<HTMLButtonElement>,
	) => {
		e.preventDefault();

		try {
			const auth = getAuth();
			const docRef = doc(
				db,
				`users/${auth.currentUser!.uid}/workout-plans`,
				`${newWorkoutPlanName}`,
			);
			await setDoc(docRef, newWorkoutPlan);
			setError({ active: false, message: '' });
		} catch (error) {
			setError({
				active: true,
				message: 'Please give your workout plan a name ',
			});
		}
	};

	return (
		<div css={styles.container}>
			<div>
				<label htmlFor=''>Name Workout Plan</label>
				<input type='text' onChange={addWorkoutPlanName} id='name' />
			</div>
			<div>
				{workoutPlan.map((currentWorkout, index) => (
					<div>
						{currentWorkout.name}
						<div>
							<label htmlFor=''>Reps</label>
							<input
								type='text'
								id='reps'
								value={currentWorkout.reps}
								onChange={e => onChange(e, index)}
							/>
						</div>
						<div>
							<label htmlFor=''>Sets</label>
							<input
								type='text'
								id='sets'
								value={currentWorkout.sets}
								onChange={e => onChange(e, index)}
							/>
						</div>
						<img
							src={remove}
							css={styles.removeButton}
							alt='remove'
							onClick={e => removeWorkout(e, currentWorkout.index)}
						/>
						<button
							type='button'
							id='up'
							onClick={e => reorder(e, currentWorkout)}
						>
							Move Up
						</button>
						<button id='down' onClick={e => reorder(e, currentWorkout)}>
							Move Down
						</button>
					</div>
				))}
			</div>
			{workoutPlan.length > 0 && (
				<button type='button' onClick={submitNewWorkoutPlan}>
					Add Workout Plan To Profile
				</button>
			)}

			{error && <div>{error.message}</div>}
		</div>
	);
};

export default CreateWorkoutPlan;
