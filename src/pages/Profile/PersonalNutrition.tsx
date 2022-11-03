/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	Timestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import DailyCalorieIntake from '../../components/DailyCalorieIntake';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import { db } from '../../firebase.config';
import useChangePage from '../../hooks/useChangePage';

interface NutritionLog {
	ingredients: DocumentData;
	loggedDate: string;
	total: DocumentData;
}

const PersonalNutrition = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			padding-top: 4rem;
			max-width: 70rem;
			margin: auto;
			gap: 3rem;
			${mq1} {
				max-width: 55rem;
			}
			${mq2} {
				max-width: 40rem;
			}
		`,
		nutritionLogContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
			background-color: whitesmoke;
			padding: 1.5rem;
		`,
		title: css`
			display: flex;
			justify-content: center;
			font-size: 32px;
		`,
		logLayout: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
		`,
		date: css`
			font-size: 20px;
			text-decoration: underline;
		`,
		ingredient: css`
			padding-left: 2rem;
			font-size: 16px;
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
		firstLogButton: css`
			font-size: 22px;
			width: 16rem;
			height: 5rem;
		`,
		buttonLayout: css`
			display: flex;
			justify-content: center;
			gap: 1rem;
		`,
	};

	const navigate = useNavigate();
	const { nextPage, prevPage } = useChangePage();

	const [nutritionLog, setNutritionLog] = useState<NutritionLog[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	const convertDate = (timeStamp: Date) => {
		alert(timeStamp);
		return new Date(timeStamp).toDateString();
	};

	useEffect(() => {
		const auth = getAuth();
		const getNutritionLog = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'nutrition-log',
			);

			const firstPageQuery = query(
				getCollection,
				orderBy('loggedDate', 'desc'),
				limit(5),
			);

			const docSnap = await getDocs(firstPageQuery);

			const nutritionLogRef: NutritionLog[] = [];

			docSnap.forEach(doc => {
				return nutritionLogRef.push({
					ingredients: doc.data().ingredients,
					loggedDate: `${doc.data().loggedDate.toDate()}`,
					total: doc.data().total,
				});
			});

			setNutritionLog(nutritionLogRef);
		};

		getNutritionLog();
	}, []);

	useEffect(() => {
		const auth = getAuth();
		const getTotalPages = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'nutrition-log',
			);
			const docSnap = await getDocs(getCollection);
			setTotalPages(Math.ceil(docSnap.docs.length / 5));
		};
		getTotalPages();
	});

	const next = async () => {
		if (currentPage > totalPages - 1) {
			return;
		}
		const results = await nextPage(currentPage, 'nutrition-log');
		setNutritionLog(results);
		setCurrentPage(currentPage + 1);
	};

	const prev = async () => {
		const results = await prevPage(currentPage - 1, 'nutrition-log');
		setNutritionLog(results);
		if (currentPage <= 1) {
			setCurrentPage(0);
		} else {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<div>
			<ProfileSideBar currentState='nutrition' />
			<div css={styles.container}>
				<DailyCalorieIntake />
				<div css={styles.nutritionLogContainer}>
					<h1 css={styles.title}>Nutrition Log</h1>
					{nutritionLog.map((nutrition, index) => (
						<div css={styles.logLayout} key={index}>
							<div css={styles.date}>{nutrition.loggedDate}</div>
							{Object.values(nutrition.ingredients).map((value, index) => (
								<div css={styles.ingredient} key={index}>
									{value}
								</div>
							))}
						</div>
					))}
					{nutritionLog.length !== 0 ? (
						<div css={styles.buttonLayout}>
							<button css={styles.button} onClick={prev}>
								Prev Page
							</button>
							<button css={styles.button} onClick={next}>
								Next Page
							</button>
						</div>
					) : (
						<div css={styles.buttonLayout}>
							<button
								css={[styles.button, styles.firstLogButton]}
								onClick={() => navigate('/nutrition')}
							>
								Log Your First Meal
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PersonalNutrition;
