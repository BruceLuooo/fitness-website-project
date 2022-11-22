/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useError } from '../../hooks/useError';
import axios from 'axios';
import DropdownMenu from '../DropdownMenu';
import DownArrow from '../../assets/svg/downArrow.svg';
import CreateWorkoutPlan from './CreateWorkoutPlan';
import Strength from '../../assets/svg/strength.svg';
import Cardio from '../../assets/svg/cardio.svg';
import FormCompleted from '../FormCompleted';
import useDelay from '../../hooks/useDelay';
import LoadingSpinner from '../LoadingSpinner';

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
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		red: css`
			color: red;
		`,
		mainContainer: css`
			display: flex;
			flex-direction: column;
			margin: auto;
			padding: 3rem;
			gap: 2rem;
			max-width: 100rem;
			width: 100%;
			height: 42rem;
			background-color: white;
			margin: 0rem 1rem 1rem;
			border-radius: 6px;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq1} {
				max-width: 60rem;
				width: unset;
				align-items: center;
				height: unset;
			}
		`,
		searchContainer: css`
			display: flex;
			margin-left: 5rem;
			margin-top: 2rem;
			gap: 4rem;
			${mq1} {
				flex-direction: column;
				margin-left: unset;
			}
		`,
		header: css`
			font-size: 40px;
			font-weight: 600;
			${mq1} {
				font-size: 50px;
			}
			${mq2} {
				font-size: 34px;
			}
		`,
		h2: css`
			font-size: 16px;
		`,
		label: css`
			font-size: 16px;
		`,
		searchQuery: css`
			display: flex;
			flex-direction: column;
			gap: 0.3rem;
			margin: 0.7rem 0;
			${mq1} {
				min-width: 4rem;
			}
		`,
		dropdownInput: css`
			display: flex;
			align-items: center;
			font-size: 16px;
			height: 1.4rem;
		`,
		dropdownMenu: css`
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			background-color: white;
			border-radius: 5px;
			text-align: left;
			/* max-width: 10rem; */
			width: 100%;
			${mq2} {
				min-width: 1rem;
			}
		`,
		icon: css`
			width: 15px;
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			max-width: 14rem;
			width: 100%;
			${mq1} {
				min-width: 10rem;
			}
			${mq2} {
				/* min-width: 5rem; */
			}
		`,
		search: css`
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 1rem;
			${mq1} {
				flex-direction: row;
				align-items: center;
				gap: 1rem;
			}
			${mq2} {
				flex-direction: column;
				align-items: unset;
			}
		`,
		findExerciseButton: css`
			background-color: #7caafa;
			border: 1px solid white;
			width: 8rem;
			height: 3rem;
			font-size: 16px;
			color: white;
			border-radius: 5px;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
			${mq1} {
				font-size: 16px;
				width: 8rem;
				height: 2.5rem;
			}
		`,
		findExercise: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		`,
		addToPlanButton: css`
			max-width: 8rem;
			${mq2} {
				max-width: 6rem;
			}
		`,
		resultsContainer: css`
			width: 28rem;
			max-height: 30rem;
			overflow-y: auto;
			${mq1} {
				min-width: 34rem;
			}
			${mq2} {
				min-width: 14rem;
				width: unset;
			}
		`,
		results: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 1rem;
			margin: 1rem 0;
			background-color: white;
			border: 1px solid #7caafa;
			border-radius: 5px;
			min-width: 2rem;
			gap: 1rem;
		`,
		displayDataSpace: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		`,
		resultFound: css`
			display: flex;
			align-items: center;
			max-width: 10rem;
			gap: 0.5rem;
		`,
		popupContainer: css`
			position: relative;
		`,
		popup: css`
			position: absolute;
			padding: 1rem;
			width: 20rem;
			background-color: white;
			font-size: 16px;
			letter-spacing: 1px;
			line-height: 1.2rem;
			z-index: 10;
		`,
	};

	const { loading, setLoading } = useDelay();
	const { error, setError } = useError();

	const typeOfExercises = [
		{ label: 'Cardio' },
		{ label: 'Plyometrics' },
		{ label: 'Powerlifting' },
		{ label: 'Strength' },
	];
	const muscleGroup = [
		{ label: 'Abdominals' },
		{ label: 'Abductors' },
		{ label: 'Biceps' },
		{ label: 'Calves' },
		{ label: 'Chest' },
		{ label: 'Glutes' },
		{ label: 'Hamstrings' },
		{ label: 'Lats' },
		{ label: 'Lower_back' },
		{ label: 'Middle_back' },
		{ label: 'Traps' },
		{ label: 'Triceps' },
	];

	useEffect(() => {
		const handler = () => setOpenMenu(0);

		window.addEventListener('click', handler);
	}, []);

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
	const [successfulPopup, setSucessfulPopup] = useState(false);

	// opens dropdown menu
	const onClick = (e: React.MouseEvent<HTMLDivElement>, number: number) => {
		e.stopPropagation();
		setOpenMenu(number);
	};

	// updates searchQuery State activity or muscleGroup property depending on which dropdown menu was opened
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

	//updates searchQuery State 'search' property
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	// API get request with information from seaerchQuery State. Data then stored into data State
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);
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
			setLoading(false);
		} else {
			setError({ active: false, message: '' });
			setLoading(false);
		}
	};

	//Selected data from Data State gets stored into workoutPlan State, which gets passed to CreateWorkoutPlan component
	const addToWorkoutPlan = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		data: Data,
		index: number,
	) => {
		const alreadySelected = workoutPlan.filter(
			workout => workout.name === data.name,
		);

		if (alreadySelected.length >= 1) return;

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
		<div css={styles.mainContainer}>
			<h1 css={styles.header}>Create A Workout Plan</h1>
			<div css={styles.searchContainer}>
				<form css={styles.formContainer} onSubmit={onSubmit}>
					<span>Step 1: Search for workouts</span>
					<div css={styles.search}>
						<div css={styles.searchQuery}>
							<label css={styles.label} htmlFor='muscleGroup'>
								MuscleGroup
							</label>
							<div>
								<div css={styles.dropdownMenu} onClick={e => onClick(e, 2)}>
									<span css={styles.dropdownInput}>
										{searchQuery.muscleGroup === ''
											? ''
											: `${searchQuery.muscleGroup}`}
									</span>
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
						<div css={styles.searchQuery}>
							<label css={styles.label} htmlFor='type'>
								Type of training (Optional)
							</label>
							<div>
								<div css={styles.dropdownMenu} onClick={e => onClick(e, 1)}>
									<span css={styles.dropdownInput}>
										{searchQuery.activity.label === ''
											? ''
											: `${searchQuery.activity.label}`}
									</span>
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
						<div css={styles.searchQuery}>
							<label css={styles.label} htmlFor='search'>
								Search (Optional)
							</label>
							<input
								css={styles.dropdownMenu}
								id='search'
								type='text'
								onChange={onChange}
							/>
						</div>
					</div>
					<div css={styles.findExercise}>
						{error && <div css={(styles.h2, styles.red)}>{error.message}</div>}
						<button css={styles.findExerciseButton} type='submit'>
							Find Workouts
						</button>
					</div>
				</form>
				{loading ? (
					<div css={styles.resultsContainer}>
						<LoadingSpinner />
					</div>
				) : (
					<div css={styles.resultsContainer}>
						<span>Step 2: Select exercise to add </span>
						{data.map((data, index) => (
							<div key={data.name} css={styles.results}>
								<div css={styles.displayDataSpace}>
									<div css={styles.resultFound}>
										<h1 css={styles.h2}>{data.name}</h1>
									</div>
									<div css={styles.resultFound}>
										<img
											css={styles.icon}
											src={data.type === 'cardio' ? Cardio : Strength}
											alt=''
										/>
										<div>{data.type}</div>
									</div>
								</div>

								<button
									css={[styles.findExerciseButton, styles.addToPlanButton]}
									onClick={e => addToWorkoutPlan(e, data, index)}
								>
									Add to plan
								</button>
							</div>
						))}
					</div>
				)}
				{!successfulPopup ? (
					<CreateWorkoutPlan
						workoutPlan={workoutPlan}
						setWorkoutPlan={setWorkoutPlan}
						setSucessfulPopup={setSucessfulPopup}
					/>
				) : (
					<FormCompleted setSucessfulPopup={setSucessfulPopup} text='Workout' />
				)}
			</div>
		</div>
	);
};

export default SearchExercises;
