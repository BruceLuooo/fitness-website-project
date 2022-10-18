/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
	collection,
	getDocs,
	addDoc,
	DocumentData,
	serverTimestamp,
	FieldValue,
	query,
	orderBy,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import { useEffect, useState } from 'react';
import { useError } from '../../hooks/useError';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import DownArrow from '../../assets/svg/downArrow.svg';

interface Workout {
	id: string;
	data: DocumentData;
}
interface AddWorkout {
	name: string;
	loggedDate?: FieldValue;
	note: string;
}

interface LogWorkout {
	name: string;
	loggedDate: string;
	note: string;
}

const PersonalFitness = () => {
	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			gap: 3rem;
			width: 100%;
			margin-top: 5rem;
		`,
		workoutOverviewContainer: css`
			border: 1px solid black;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: aliceblue;
			width: 50%;
			padding: 1.5rem;
		`,
		dropdownMenu: css`
			position: absolute;
			transform: translateY(52px);
			width: 100%;
			border: 1px solid #ccc;
			border-radius: 5px;
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
		dropdownInput: css`
			background-color: white;
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			border-radius: 5px;
		`,
		icon: css`
			width: 15px;
		`,
	};

	const { error, setError } = useError();

	const [workoutPlans, setWorkoutPlans] = useState<Workout[]>([]);
	const [workoutLog, setWorkoutLog] = useState<LogWorkout[]>([]);
	const [addWorkoutLog, setAddWorkoutLog] = useState<AddWorkout>({
		name: '',
		loggedDate: serverTimestamp(),
		note: '',
	});
	const [showMenu, setShowMenu] = useState(false);
	const [rerender, setRerender] = useState<AddWorkout>();

	useEffect(() => {
		const auth = getAuth();
		const getWorkoutPlans = async () => {
			const test = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'workout-plans',
			);

			const docSnap = await getDocs(test);
			const data: Workout[] = [];

			docSnap.forEach(doc => {
				return data.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setWorkoutPlans(data);
		};

		getWorkoutPlans();
	}, []);
	useEffect(() => {
		const auth = getAuth();
		const getWorkoutLog = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'workout-log',
			);

			const q = query(getCollection, orderBy('loggedDate'));

			const docSnap = await getDocs(q);
			const workoutLogRef: LogWorkout[] = [];

			docSnap.forEach(doc => {
				return workoutLogRef.push({
					name: doc.data().name,
					loggedDate: `${doc.data().loggedDate.toDate()}`,
					note: doc.data().note,
				});
			});

			setWorkoutLog(workoutLogRef);
		};

		getWorkoutLog();
	}, [rerender]);
	useEffect(() => {
		const handler = () => setShowMenu(false);

		window.addEventListener('click', handler);
	});

	const handleInputClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
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

			setRerender(addWorkoutLog);
		} catch (error) {
			setError({ active: true, message: 'Could not log workout' });
		}
	};

	return (
		<div>
			<ProfileSideBar currentState='fitness' />
			<div css={styles.container}>
				<div css={styles.workoutOverviewContainer}>
					<p>My Workout Plans</p>
					{workoutPlans.map(plan => (
						<div>
							<div>
								<div>{plan.id}</div>
								{Object.values(plan.data).map((key, index) => (
									<div key={index}>{key}</div>
								))}
							</div>
						</div>
					))}
				</div>
				<div css={styles.workoutOverviewContainer}>
					{workoutLog.map(log => (
						<div>
							<div>{log.name}</div>
							<div>{log.loggedDate}</div>
							<div>{log.note}</div>
						</div>
					))}
					<div>
						<p>Log your workout</p>
						<div>
							<div css={styles.dropdownInput} onClick={handleInputClick}>
								<div>
									{addWorkoutLog.name === '' ? '' : `${addWorkoutLog.name}`}
								</div>
								<img src={DownArrow} alt='' css={styles.icon} />
							</div>
						</div>

						{showMenu === true && (
							<div css={styles.dropdownMenu}>
								{workoutPlans.map(plan => (
									<div
										key={plan.data.id}
										css={styles.dropdownitem}
										onClick={e => onSelectedWorkoutPlan(e, plan.id)}
									>
										{plan.id}
									</div>
								))}
							</div>
						)}
					</div>
					<textarea onChange={onChange} id='note' placeholder={'Add Note'} />
					<button onClick={logWorkout}>Log Workout</button>
					{error && <div>{error.message} </div>}
				</div>
			</div>
		</div>
	);
};

export default PersonalFitness;
