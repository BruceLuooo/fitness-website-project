/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import QuestionMark from '../assets/questionMark.png';
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

const DailyCalorieIntake = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			gap: 2.5rem;
			background-color: whitesmoke;
			padding: 1.5rem 10rem;
			${mq1} {
				padding: 1.5rem 5rem;
			}
			${mq1} {
				padding: 1.5rem 2rem;
			}
		`,
		header: css`
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 20rem;
			gap: 1rem;
		`,
		title: css`
			font-size: 32px;
			${mq1} {
				font-size: 26px;
			}
			${mq2} {
				font-size: 20px;
			}
		`,
		label: css`
			font-size: 20px;
			${mq2} {
				font-size: 16px;
			}
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			min-width: 20rem;
			width: 50%;
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
			width: 16px;
		`,
		button: css`
			height: 2rem;
			background-color: #7caafa;
			border: 1px solid #ccc;
			width: 8rem;
			height: 3rem;
			font-size: 16px;
			border-radius: 5px;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
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
			left: 1rem;
			padding: 1rem;
			width: 20rem;
			background-color: white;
			font-size: 16px;
			letter-spacing: 1px;
			line-height: 1.2rem;
			z-index: 10;
			${mq2} {
				left: -20rem;
			}
		`,
		formAndResultsContainer: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 4rem;
			${mq2} {
				flex-direction: column;
				align-items: unset;
				gap: 2rem;
			}
		`,

		updateDailyCalorieIntake: css`
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			${mq2} {
				flex-direction: row;
			}
		`,
		updateCalorieMessage: css`
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 20px;
		`,
		results: css`
			width: 20rem;
			height: 6rem;
			font-size: 18px;
			${mq1} {
				width: 15rem;
			}
			${mq2} {
				height: 6rem;
				font-size: 14px;
				letter-spacing: 1.2px;
				word-spacing: 1px;
			}
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
	const [updateCalories, setUpdateCalories] = useState({
		active: false,
		message: '',
	});

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
				setUpdateCalories({ active: false, message: '' });
				return setCalorieIntake(dailyCalorieForMale);
			} else {
				setError({ active: false, message: '' });
				setUpdateCalories({ active: false, message: '' });
				return setCalorieIntake(dailyCalorieForFemale);
			}
		}
	};

	const updateMonthlyCalorieIntake = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		totalCalories: number,
	) => {
		try {
			const auth = getAuth();

			const docRef = doc(db, `users/${auth.currentUser!.uid}`);
			await updateDoc(docRef, {
				caloriesPerDay: totalCalories,
			});
			setUpdateCalories({
				active: true,
				message: 'Daily Calorie Intake Target Updated ',
			});
		} catch (error) {
			setUpdateCalories({
				active: true,
				message: 'Log In To Save This Information',
			});
		}
	};

	return (
		<div css={styles.container}>
			<div css={styles.header}>
				<div css={styles.title}>Calculate Your Daily Calorie Intake</div>
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
			<div css={styles.formAndResultsContainer}>
				<form css={styles.formContainer} onSubmit={onSubmit}>
					<div css={styles.formInput}>
						<label css={styles.label} htmlFor='age'>
							Age{' '}
						</label>
						<input id='age' type='number' required onChange={onChange} />
					</div>
					<div css={styles.formInput}>
						<label css={styles.label} htmlFor='Gender'>
							Gender
						</label>
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
						<label css={styles.label} htmlFor='height'>
							Height (cm)
						</label>
						<input id='height' type='number' required onChange={onChange} />
					</div>
					<div css={styles.formInput}>
						<label css={styles.label} htmlFor='weight'>
							Weight (kg)
						</label>
						<input id='weight' type='number' required onChange={onChange} />
					</div>
					<div css={styles.formInput}>
						<label css={styles.label} htmlFor='activity'>
							Activity
						</label>

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
				{calorieIntake > 0 && updateCalories.active === false && (
					<div css={styles.updateDailyCalorieIntake}>
						<p css={styles.label}>Set Daily Calorie Intake Target</p>
						<button
							css={[styles.button, styles.results]}
							onClick={e => updateMonthlyCalorieIntake(e, calorieIntake + 500)}
						>
							Gain weight (~ 1lbs/week): {calorieIntake + 500} Calories
						</button>
						<button
							css={[styles.button, styles.results]}
							onClick={e => updateMonthlyCalorieIntake(e, calorieIntake)}
						>
							Maintain weight: {calorieIntake} Calories
						</button>
						<button
							css={[styles.button, styles.results]}
							onClick={e => updateMonthlyCalorieIntake(e, calorieIntake - 500)}
						>
							Lose weight (~ 1lbs/week): {calorieIntake - 500} Calories
						</button>
					</div>
				)}
				{updateCalories.active === true && (
					<div css={styles.updateCalorieMessage}>{updateCalories.message}</div>
				)}
			</div>
		</div>
	);
};

export default DailyCalorieIntake;
