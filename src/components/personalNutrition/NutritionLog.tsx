/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import {
	collection,
	query,
	orderBy,
	limit,
	getDocs,
	DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase.config';
import useChangePage from '../../hooks/personalNutrition/useChangePage';

interface NutritionLogs {
	ingredients: DocumentData;
	loggedDate: string;
	total: DocumentData;
}

const NutritionLog = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;

	const styles = {
		nutritionLogContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding: 3rem;
			margin: 0rem 1rem 1rem;
			border-radius: 6px;
			background-color: white;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq1} {
				padding: 1rem;
			}
		`,
		title: css`
			display: flex;
			font-size: 32px;
			font-weight: 600;
		`,
		logLayout: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.5rem;
			max-width: 30rem;
			width: 100%;
			border: 2px solid #eeedf3;
			border-radius: 6px;
		`,
		date: css`
			font-size: 17px;
			text-decoration: underline;
		`,
		ingredient: css`
			padding-left: 0.5rem;
			font-size: 17px;
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
		firstLogButton: css`
			font-size: 22px;
			width: 16rem;
			height: 5rem;
			box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		`,
		buttonLayout: css`
			display: flex;
			gap: 1rem;
		`,
	};

	const convertDate = (timeStamp: Date) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};
	const { nextPage, prevPage } = useChangePage();
	const navigate = useNavigate();

	const [nutritionLog, setNutritionLog] = useState<NutritionLogs[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

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

			const nutritionLogRef: NutritionLogs[] = [];

			docSnap.forEach(doc => {
				return nutritionLogRef.push({
					ingredients: doc.data().ingredients,
					loggedDate: convertDate(doc.data().loggedDate.toDate()),
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
	}, []);

	const next = async () => {
		if (currentPage > totalPages - 2) {
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
	);
};

export default NutritionLog;
