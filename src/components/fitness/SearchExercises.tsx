/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useError } from '../../hooks/useError';
import axios from 'axios';
import DropdownMenu from '../DropdownMenu';
import DownArrow from '../../assets/svg/downArrow.svg';
import CreateWorkoutPlan from './CreateWorkoutPlan';

interface SearchQuery {
	search: string;
	activity: { label: string };
	muscleGroup: string;
}

interface Data {
	name: string;
	type?: string;
	equipment?: string;
	instructions?: string;
}

interface WorkoutData {
	name: string;
	index: number;
	reps: number;
	sets: number;
}

const SearchExercises = () => {
	const styles = {
		container: css`
			display: flex;
			gap: 1rem;
			background-color: aliceblue;
			padding: 1.5rem;
			gap: 4rem;
		`,
		dropdownInput: css`
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			border-radius: 5px;
			text-align: left;
			width: 100%;
		`,
		icon: css`
			width: 15px;
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
		`,
		resultsContainer: css`
			max-height: 30rem;
			overflow-y: auto;
		`,
		results: css`
			display: flex;
			flex-direction: column;
			max-width: 30rem;
			border: 1px solid black;
		`,
	};

	const { error, setError } = useError();

	const typeOfExercises = [
		{ label: 'cardio' },
		{ label: 'plyometrics' },
		{ label: 'powerlifting' },
		{ label: 'strength' },
	];
	const muscleGroup = [
		{ label: 'abdominals' },
		{ label: 'abductors' },
		{ label: 'biceps' },
		{ label: 'calves' },
		{ label: 'chest' },
		{ label: 'glutes' },
		{ label: 'hamstrings' },
		{ label: 'lats' },
		{ label: 'lower_back' },
		{ label: 'middle_back' },
		{ label: 'traps' },
		{ label: 'triceps' },
	];

	useEffect(() => {
		const handler = () => setOpenMenu(0);

		window.addEventListener('click', handler);
	});

	const [searchQuery, setSearchQuery] = useState<SearchQuery>({
		search: '',
		activity: {
			label: '',
		},
		muscleGroup: '',
	});
	const [openMenu, setOpenMenu] = useState(0);
	const [data, setData] = useState<Data[]>([]);
	const [workoutPlan, setWorkoutPlan] = useState<WorkoutData[]>([]);

	const onClick = (e: React.MouseEvent<HTMLDivElement>, number: number) => {
		e.stopPropagation();
		setOpenMenu(number);
	};

	const onSelectedOption = (label: string, value: number) => {
		const findSelectedOption = typeOfExercises.find(
			option => option.label === label,
		);

		if (findSelectedOption) {
			setSearchQuery(prev => ({
				...prev,
				activity: { label, value },
			}));
		} else {
			setSearchQuery(prev => ({
				...prev,
				muscleGroup: label,
			}));
		}
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setData([]);

		const config = {
			headers: {
				'X-API-KEY': `${process.env.REACT_APP_EXERCISES_KEY}`,
			},
			params: {
				name: searchQuery.search,
				type: searchQuery.activity.label,
				muscle: searchQuery.muscleGroup,
			},
		};

		const { data } = await axios.get(
			`https://api.api-ninjas.com/v1/exercises`,
			config,
		);

		data.forEach((data: any) => {
			setData(prev => [
				...prev,
				{
					name: data.name,
					type: data.type,
					equipment: data.equipment,
					instructions: data.instructions,
				},
			]);
		});

		if (data.length === 0) {
			setError({ active: true, message: 'No Workout Found' });
		} else {
			setError({ active: false, message: '' });
		}
	};

	const addToWorkoutPlan = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		data: Data,
		index: number,
	) => {
		setWorkoutPlan(prev => [
			...prev,
			{
				name: data.name,
				index: index,
				reps: 0,
				sets: 0,
			},
		]);
	};

	return (
		<div css={styles.container}>
			<form css={styles.formContainer} onSubmit={onSubmit}>
				<div>
					<label htmlFor='search'>Search (Optional)</label>
					<input id='search' type='text' onChange={onChange} />
				</div>
				<div>
					<label htmlFor='type'>Type of training (Optional)</label>
					<div>
						<div css={styles.dropdownInput} onClick={e => onClick(e, 1)}>
							<div>
								{searchQuery.activity.label === ''
									? ''
									: `${searchQuery.activity.label}`}
							</div>
							<img src={DownArrow} alt='' css={styles.icon} />
						</div>
						{openMenu === 1 && (
							<DropdownMenu
								selectOptions={typeOfExercises}
								onSelectedOption={onSelectedOption}
							/>
						)}
					</div>
				</div>
				<div>
					<label htmlFor='muscleGroup'>MuscleGroup (Optional)</label>
					<div>
						<div css={styles.dropdownInput} onClick={e => onClick(e, 2)}>
							<div>
								{searchQuery.muscleGroup === ''
									? ''
									: `${searchQuery.muscleGroup}`}
							</div>
							<img src={DownArrow} alt='' css={styles.icon} />
						</div>
						{openMenu === 2 && (
							<DropdownMenu
								selectOptions={muscleGroup}
								onSelectedOption={onSelectedOption}
							/>
						)}
					</div>
				</div>
				{error && <div>{error.message}</div>}
				<button type='submit'>Find</button>
			</form>
			<div css={styles.resultsContainer}>
				{data.map((data, index) => (
					<div key={data.name} css={styles.results}>
						<button onClick={e => addToWorkoutPlan(e, data, index)}>
							Add to plan
						</button>
						<div>{data.name}</div>
						<div>{data.type}</div>
						<div>{data.equipment}</div>
						<div>{data.instructions}</div>
					</div>
				))}
			</div>
			<CreateWorkoutPlan
				workoutPlan={workoutPlan}
				setWorkoutPlan={setWorkoutPlan}
			/>
		</div>
	);
};

export default SearchExercises;
