/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import QuestionMark from '../assets/svg/questionMark.svg';
import DownArrow from '../assets/svg/downArrow.svg';
import { useError } from '../hooks/useError';
import { usePopup } from '../hooks/usePopup';
import DropdownMenu from './DropdownMenu';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';

interface Data {
	age: number;
	gender: string;
	height: number;
	weight: number;
	activity: { label: string; value: number };
}

interface Props {
	setCalorieTarget: Function;
}

const DailyCalorieIntake: FC<Props> = ({ setCalorieTarget }) => {
	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: aliceblue;
			width: 25rem;
			padding: 1.5rem;
		`,
		text: css`
			font-size: 16px;
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
		`,
		formInput: css`
			display: flex;
			align-items: center;
			justify-content: space-between;
		`,
		dropdownContainer: css`
			position: relative;
			width: 50%;
			background-color: white;
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
		dropdownMenu: css`
			position: absolute;
			border: 1px solid #ccc;
			border-radius: 5px;
			width: 25rem;
			overflow: auto;
			max-height: 150px;
			background-color: white;
			z-index: 10;
		`,
		dropdownitem: css`
			padding: 5px;
			cursor: pointer;
			&:hover {
				background-color: #9fc3f870;
			}
		`,
		icon: css`
			width: 15px;
		`,
		button: css`
			width: 50%;
			padding: 0.5rem 1rem;
		`,
		radiobutton: css`
			display: flex;
			gap: 1.5rem;
		`,
		error: css`
			color: red;
		`,
		popupContainer: css`
			position: relative;
		`,
		popup: css`
			position: absolute;
			padding: 1rem;
			width: 20rem;
			background-color: whitesmoke;
			font-size: 16px;
			letter-spacing: 1px;
			line-height: 1.2rem;
			z-index: 10;
		`,
	};

	const { error, setError } = useError();
	const { popup, setPopup } = usePopup();
	useEffect(() => {
		const handler = () => setOpenMenu(false);

		window.addEventListener('click', handler);
	});

	const selectOptions = [
		{ label: 'Lightly active: Exercise 1-3 times/week', value: 1.375 },
		{ label: 'Moderately active: Exercise 4-5 times/week', value: 1.55 },
		{
			label: 'Active: Daily exercise daily or intense exercise 3-4 times/week',
			value: 1.725,
		},
		{ label: 'Very active: Intense exercise 6-7 times/week', value: 1.9 },
	];

	const [data, setData] = useState<Data>({
		age: 0,
		gender: '',
		height: 0,
		weight: 0,
		activity: { label: '', value: 0 },
	});
	const [calorieIntake, setCalorieIntake] = useState(0);
	const [openMenu, setOpenMenu] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		setOpenMenu(!openMenu);
	};

	const onSelectedOption = (label: string, value: number) => {
		setData(prev => ({
			...prev,
			activity: { label, value },
		}));
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			data.age === null ||
			data.height === null ||
			data.weight === null ||
			data.activity.value === null ||
			data.activity.label === '' ||
			data.gender === ''
		) {
			return setError({ active: true, message: 'Please fill in all fields' });
		} else {
			const gender = data.gender === 'male' ? 161 : 5;
			const dailyCalorieForMale = Math.round(
				(10 * data.weight + 6.25 * data.height - 5 * data.age + gender) *
					data.activity.value,
			);
			const dailyCalorieForFemale = Math.round(
				(10 * data.weight + 6.25 * data.height - 5 * data.age - gender) *
					data.activity.value,
			);
			if (data.gender === 'male') {
				setError({ active: false, message: '' });
				return setCalorieIntake(dailyCalorieForMale);
			} else {
				setError({ active: false, message: '' });
				return setCalorieIntake(dailyCalorieForFemale);
			}
		}
	};

	const updateMonthlyCalorieIntake = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		totalCalories: number,
	) => {
		const auth = getAuth();

		const docRef = doc(db, `users/${auth.currentUser!.uid}`);
		await updateDoc(docRef, {
			caloriesPerDay: totalCalories,
		});

		setCalorieTarget(totalCalories);
	};

	return (
		<div css={styles.container}>
			<div css={styles.formInput}>
				<div css={styles.text}>Calculate Your Daily Calorie Intake</div>
				<div
					css={styles.popupContainer}
					onMouseOverCapture={() => setPopup(true)}
					onMouseOutCapture={() => setPopup(false)}
				>
					<img src={QuestionMark} alt='question-mark' css={styles.icon} />
					{popup && (
						<p css={styles.popup}>
							Using the Mifflin-St Jeor Equation to predict daily energy
							expenditure in healthy adults, calculate you're estimated daily
							calorie intake now!
						</p>
					)}
				</div>
			</div>
			<form css={styles.formContainer} onSubmit={onSubmit}>
				<div css={styles.formInput}>
					<label htmlFor='age'>Age </label>
					<input id='age' type='number' required onChange={onChange} />
				</div>
				<div css={styles.formInput}>
					<label htmlFor='Gender'>Gender</label>
					<div css={styles.radiobutton}>
						<div>
							<input
								type='radio'
								id='gender'
								value='male'
								checked={data.gender === 'male' && true}
								onChange={onChange}
							/>
							<label htmlFor='male'>Male</label>
						</div>
						<div>
							<input
								type='radio'
								id='gender'
								value='female'
								checked={data.gender === 'female' && true}
								onChange={onChange}
							/>
							<label htmlFor='female'>Female</label>
						</div>
					</div>
				</div>
				<div css={styles.formInput}>
					<label htmlFor='height'>Height (cm)</label>
					<input id='height' type='number' required onChange={onChange} />
				</div>
				<div css={styles.formInput}>
					<label htmlFor='weight'>Weight (kg)</label>
					<input id='weight' type='number' required onChange={onChange} />
				</div>
				<div css={styles.formInput}>
					<label htmlFor='activity'>Activity</label>

					<div css={styles.dropdownContainer}>
						<div css={styles.dropdownInput} onClick={onClick}>
							<div>
								{data.activity.label === '' ? '' : `${data.activity.label}`}
							</div>
							<img src={DownArrow} alt='' css={styles.icon} />
						</div>
						{openMenu === true && (
							<DropdownMenu
								selectOptions={selectOptions}
								onSelectedOption={onSelectedOption}
							/>
						)}
					</div>
				</div>
				<div css={styles.error}>{error && <div>{error.message}</div>}</div>
				<button css={styles.button} type='submit'>
					Calculate
				</button>
			</form>
			<div>
				{calorieIntake > 0 && (
					<div>
						<button
							css={styles.text}
							onClick={e => updateMonthlyCalorieIntake(e, calorieIntake)}
						>
							Maintain weight: {calorieIntake} Calories
						</button>
						<button
							css={styles.text}
							onClick={e => updateMonthlyCalorieIntake(e, calorieIntake - 500)}
						>
							Lose weight (~ 1lbs/week):
							{calorieIntake - 500} Calories
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default DailyCalorieIntake;
