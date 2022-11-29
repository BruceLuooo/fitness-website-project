/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import {
	serverTimestamp,
	collection,
	addDoc,
	FieldValue,
	DocumentData,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { useError } from '../../hooks/useError';
import DownArrow from '../../assets/svg/downArrow.svg';

interface AddWorkout {
	name: string;
	loggedDate?: FieldValue;
	note: string;
}

interface Workout {
	id: string;
	data: DocumentData;
}

type Props = {
	workoutPlans: Workout[];
	setRerender: Function;
	setCurrentPage: Function;
	rerender: boolean;
};

const AddToWorkoutLog = ({
	workoutPlans,
	setRerender,
	setCurrentPage,
	rerender,
}: Props) => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		largeFont: css`
			font-size: 32px;
			font-weight: 600;
		`,
		addWorkoutLog: css`
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 1rem;
			max-width: 16rem;
			width: 100%;
			padding-right: 2rem;
			border-right: 2px solid black;
			${mq1} {
				width: unset;
				border-right: none;
			}
			${mq2} {
				border-right: unset;
			}
		`,
		dropdownMenu: css`
			position: absolute;
			transform: translateY(16px);
			max-width: 18rem;
			width: 100%;
			border: 1px solid #ccc;
			border-radius: 5px;
			overflow: auto;
			max-height: 150px;
			background-color: white;
			z-index: 10;

			${mq2} {
				transform: translateY(16px);
				width: 18rem;
			}
		`,
		dropdownitem: css`
			padding: 5px;
			cursor: pointer;
			&:hover {
				background-color: #9fc3f870;
			}
		`,
		dropdownInput: css`
			background-color: white;
			padding: 10px;
			height: 2.5rem;
			font-size: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			border-radius: 5px;
		`,
		addNote: css`
			height: 4rem;
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
		icon: css`
			width: 15px;
		`,
	};

	const { error, setError } = useError();
	const [showMenu, setShowMenu] = useState(false);
	const [addWorkoutLog, setAddWorkoutLog] = useState<AddWorkout>({
		name: '',
		loggedDate: serverTimestamp(),
		note: '',
	});

	useEffect(() => {
		const handler = () => setShowMenu(false);

		window.addEventListener('click', handler);
	}, []);

	const handleInputClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
	};

	const logWorkout = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (addWorkoutLog.name === '') {
			return setError({ active: true, message: 'Could not log workout' });
		}

		try {
			const auth = getAuth();
			const docRef = collection(
				db,
				`users/${auth.currentUser!.uid}/workout-log`,
			);
			await addDoc(docRef, addWorkoutLog);
			setError({ active: false, message: '' });

			setRerender(!rerender);
			setAddWorkoutLog({ name: '', loggedDate: serverTimestamp(), note: '' });
		} catch (error) {
			setError({ active: true, message: 'Could not log workout' });
		}

		setCurrentPage(0);
	};

	const onSelectedWorkoutPlan = (
		e: React.MouseEvent<HTMLDivElement>,
		plan: string,
	) => {
		setAddWorkoutLog(prev => ({
			...prev,
			name: plan,
		}));
	};
	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAddWorkoutLog(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	return (
		<div css={styles.addWorkoutLog}>
			<p css={styles.largeFont}>Log your workout</p>
			<div css={styles.dropdownInput} onClick={handleInputClick}>
				<div>{addWorkoutLog.name === '' ? '' : `${addWorkoutLog.name}`}</div>
				<img src={DownArrow} alt='' css={styles.icon} />
			</div>

			{showMenu === true && (
				<div css={styles.dropdownMenu}>
					{workoutPlans.map((plan, index) => (
						<div
							key={index}
							css={styles.dropdownitem}
							onClick={e => onSelectedWorkoutPlan(e, plan.id)}
						>
							{plan.id}
						</div>
					))}
				</div>
			)}
			<textarea
				css={styles.addNote}
				onChange={onChange}
				id='note'
				value={addWorkoutLog.note}
				placeholder={'Add Note'}
			/>
			<button css={styles.button} onClick={logWorkout}>
				Log Workout
			</button>
			{error && <div>{error.message} </div>}
		</div>
	);
};

export default AddToWorkoutLog;
