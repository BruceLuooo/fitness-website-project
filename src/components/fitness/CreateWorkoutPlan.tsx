/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useRef, useState } from 'react';
import { useError } from '../../hooks/useError';
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

	const workoutPlanName = useRef(null);

	const removeWorkout = (
		e: React.MouseEvent<HTMLImageElement>,
		index: number,
	) => {
		const remove = workoutPlan.filter(workout => workout.index !== index);

		setWorkoutPlan(remove);
	};

	const reorder = (e: any, data: data) => {
		console.log(e.target.id);
		const newIndex = workoutPlan
			.map(workout => workout.index)
			.indexOf(data.index + e.target.id === 'up' ? -2 : 0);

		const newArray = workoutPlan.filter(
			workout => workout.index !== data.index,
		);

		newArray.splice(newIndex, 0, data);
		setWorkoutPlan(newArray);
	};

	const submitNewWorkoutPlan = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
	};

	return (
		<div css={styles.container}>
			<div>
				<label htmlFor=''>Name Workout Plan</label>
				<input ref={workoutPlanName} type='text' name='' id='' />
			</div>
			<div>
				{workoutPlan.map(currentWorkout => (
					<div>
						{currentWorkout.name}
						<div>
							<label htmlFor=''>Reps</label>
							<input type='text' />
						</div>
						<div>
							<label htmlFor=''>Sets</label>
							<input type='text' />
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
