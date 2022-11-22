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
	limit,
	deleteDoc,
	doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import { useEffect, useState } from 'react';
import { useError } from '../../hooks/useError';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import DownArrow from '../../assets/svg/downArrow.svg';
import RightArrow from '../../assets/svg/rightArrow.svg';
import useChangePageFitnessLog from '../../hooks/useChangePageFitnessLog';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import useDelay from '../../hooks/useDelay';
import SearchExercises from '../../components/fitness/SearchExercises';

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

interface SingleWorkoutPlan {
	id: string;
	index: number;
	workoutPlan: DocumentData;
}

const PersonalFitness = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		largeFont: css`
			font-size: 32px;
			font-weight: 600;
		`,
		mainContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
		`,
		sideBar: css`
			max-width: 800px;
			width: 100%;
			margin: auto;
		`,
		container: css`
			display: flex;
			flex-direction: column;
			padding-top: 4rem;
			max-width: 80%;
			width: 100%;
			margin: auto;
			gap: 3rem;
			border-left: 4px solid white;
			${mq1} {
				max-width: 100%;
				padding-top: 1rem;
			}
		`,
		firstHalfLayout: css`
			display: flex;
			width: 100%;
			${mq2} {
				flex-direction: column;
			}
		`,
		workoutPlansContainer: css`
			display: flex;
			flex-direction: column;
			justify-content: center;
			max-width: 48rem;
			width: 100%;
			gap: 1rem;
			margin: 0rem 1rem 1rem;
			padding: 2rem 2rem;
			background-color: white;
			border-radius: 6px;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq2} {
				align-items: center;
				width: unset;
			}
		`,
		workoutPlanLayout: css`
			display: flex;
			gap: 2rem;
			max-width: 40rem;
			width: 100%;
			${mq1} {
				flex-direction: column;
			}
		`,
		workoutPlanNameLayout: css`
			display: flex;
			flex-direction: column;
			max-height: 20rem;
			overflow-y: scroll;
			gap: 0.5rem;
			${mq1} {
				max-height: 24rem;
				overflow-y: scroll;
				height: 8rem;
			}
		`,
		workoutPlansName: css`
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 4rem;
			border: 1px solid #ccc;
			padding: 0 2rem;
			border-radius: 5px;
			width: 16rem;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
			${mq1} {
				padding: 0 0.5rem;
			}
		`,
		selected: css`
			background-color: #4f8efb;
			color: white;
		`,
		exercises: css`
			display: flex;
			flex-direction: column;
			padding: 1rem;
			max-width: 20rem;
			width: 100%;
			border: 2px solid #eeedf3;
			border-radius: 6px;
			gap: 1rem;
			${mq1} {
				min-width: 20rem;
			}
			${mq2} {
				min-width: 10rem;
			}
		`,
		name: css`
			font-size: 18px;
			${mq1} {
				font-size: 16px;
			}
		`,
		rightArrowIcon: css`
			width: 18px;
		`,
		workoutLogContainer: css`
			display: flex;
			gap: 2rem;
			padding: 2rem;
			margin: 0rem 1rem 1rem;
			max-width: 48rem;
			width: 100%;
			border-radius: 6px;
			background-color: white;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq1} {
				flex-direction: column;
			}
			${mq2} {
				align-items: center;
				padding: 2rem 2rem;
				width: unset;
			}
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
		deleteButton: css`
			margin-top: 3rem;
			background-color: #ff8181;
			&:hover {
				background-color: red;
			}
			${mq2} {
				width: 5rem;
				padding: 0 0.5rem;
			}
		`,
		icon: css`
			width: 15px;
		`,
		logLayout: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			margin-bottom: 0.5rem;
			padding: 0.5rem;
			max-width: 20rem;
			border: 2px solid #eeedf3;
			border-radius: 6px;
			width: 100%;
		`,
		date: css`
			font-size: 17px;
			text-decoration: underline;
		`,
		text: css`
			font-size: 17px;
			padding-left: 0.5rem;
		`,
		workoutValue: css`
			font-size: 16px;
		`,
		buttonLayout: css`
			display: flex;
			gap: 1rem;
		`,
	};

	const navigate = useNavigate();
	const { loading, setLoading, delay } = useDelay();
	const { error, setError } = useError();
	const { nextPage, prevPage } = useChangePageFitnessLog();

	const [workoutPlans, setWorkoutPlans] = useState<Workout[]>([]);
	const [singlePlan, setSinglePlan] = useState<SingleWorkoutPlan>({
		id: '',
		index: 10000,
		workoutPlan: { inital: 'Select Workout Plan To View' },
	});
	const [workoutLog, setWorkoutLog] = useState<LogWorkout[]>([]);
	const [addWorkoutLog, setAddWorkoutLog] = useState<AddWorkout>({
		name: '',
		loggedDate: serverTimestamp(),
		note: '',
	});
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [showMenu, setShowMenu] = useState(false);
	const [rerender, setRerender] = useState(false);

	const convertDate = (timeStamp: Date) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};

	useEffect(() => {
		setLoading(true);
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
			await delay(1000);
			setLoading(false);
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

			const q = query(getCollection, orderBy('loggedDate', 'desc'), limit(5));

			const docSnap = await getDocs(q);
			const workoutLogRef: LogWorkout[] = [];

			docSnap.forEach(doc => {
				return workoutLogRef.push({
					name: doc.data().name,
					loggedDate: convertDate(doc.data().loggedDate.toDate()),
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
	}, []);
	useEffect(() => {
		const auth = getAuth();
		const getTotalPages = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'workout-log',
			);
			const docSnap = await getDocs(getCollection);
			setTotalPages(Math.ceil(docSnap.docs.length / 5));
		};
		getTotalPages();
	}, []);

	//Open selected Dropdown Menu
	const handleInputClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
	};

	//Updates name property in addWorkoutLog State
	const onSelectedWorkoutPlan = (
		e: React.MouseEvent<HTMLDivElement>,
		plan: string,
	) => {
		setAddWorkoutLog(prev => ({
			...prev,
			name: plan,
		}));
	};

	//Updates note property in addWorkoutLog State
	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAddWorkoutLog(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	//Add workoutLog to Firebase database
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

	// See workout information of selected workout plan
	const seeWorkoutPlan = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
		plan: Workout,
	) => {
		setSinglePlan({
			id: plan.id,
			index: index,
			workoutPlan: plan.data,
		});
	};

	// Delete selected workout plan from Firebase Database
	const deleteWorkoutPlan = async (id: string) => {
		const auth = getAuth();
		const docRef = doc(
			db,
			`users/${auth.currentUser!.uid}/workout-plans/${id}`,
		);
		await deleteDoc(docRef);

		const remainingPlans = workoutPlans.filter(plan => plan.id !== id);
		setWorkoutPlans(remainingPlans);
		setSinglePlan({
			id: '',
			index: 10000,
			workoutPlan: { inital: 'Select Workout Plan To View' },
		});
	};

	// Next and Prev page of workout Log
	const prev = async () => {
		const results = await prevPage(currentPage - 1, 'workout-log');
		setWorkoutLog(results);
		if (currentPage <= 1) {
			setCurrentPage(0);
		} else {
			setCurrentPage(currentPage - 1);
		}
	};
	const next = async () => {
		if (currentPage > totalPages - 2) {
			return;
		}
		const results = await nextPage(currentPage, 'workout-log');
		setWorkoutLog(results);
		setCurrentPage(currentPage + 1);
	};

	return (
		<div css={styles.mainContainer}>
			<div css={styles.sideBar}>
				<ProfileSideBar currentState='fitness' />
			</div>
			<div css={styles.container}>
				<div css={styles.firstHalfLayout}>
					<div css={styles.workoutLogContainer}>
						<div css={styles.addWorkoutLog}>
							<p css={styles.largeFont}>Log your workout</p>
							<div css={styles.dropdownInput} onClick={handleInputClick}>
								<div>
									{addWorkoutLog.name === '' ? '' : `${addWorkoutLog.name}`}
								</div>
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
						{workoutLog.length === 0 ? (
							<div css={styles.logLayout}>
								<LoadingSpinner />
							</div>
						) : (
							<div>
								{workoutLog.map((log, index) => (
									<div css={styles.logLayout} key={index}>
										<div css={styles.date}>{log.loggedDate}</div>
										<p css={styles.text}>Workout Plan: {log.name}</p>
										<p css={styles.text}>Notes: {log.note}</p>
									</div>
								))}
								{workoutLog.length !== 0 && (
									<div css={styles.buttonLayout}>
										<button css={styles.button} onClick={prev}>
											Prev
										</button>
										<button css={styles.button} onClick={next}>
											Next
										</button>
									</div>
								)}
							</div>
						)}
					</div>
					<div css={styles.workoutPlansContainer}>
						<h1 css={styles.largeFont}>My Workout Plans</h1>
						<div css={styles.workoutPlanLayout}>
							<div css={styles.workoutPlanNameLayout}>
								{loading ? (
									<div>
										<LoadingSpinner />
									</div>
								) : (
									<div>
										{workoutPlans.length === 0 ? (
											<button
												css={styles.button}
												onClick={() => navigate('/fitness')}
											>
												Create your first workout plan
											</button>
										) : (
											<div>
												{workoutPlans.map((plan, index) => (
													<div
														key={index}
														css={
															singlePlan.index === index
																? [styles.workoutPlansName, styles.selected]
																: styles.workoutPlansName
														}
														onClick={e => seeWorkoutPlan(e, index, plan)}
													>
														<div css={styles.name}>{plan.id}</div>
														<img
															css={styles.rightArrowIcon}
															src={RightArrow}
															alt='right arrow'
														/>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
							<div css={styles.exercises}>
								{Object.values(singlePlan.workoutPlan).map((value, index) => (
									<div key={index} css={styles.workoutValue}>
										{value}
									</div>
								))}
								{singlePlan.index !== 10000 && (
									<button
										css={[styles.button, styles.deleteButton]}
										onClick={() => deleteWorkoutPlan(singlePlan.id)}
									>
										Delete Workout
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
				<SearchExercises />
			</div>
		</div>
	);
};

export default PersonalFitness;
