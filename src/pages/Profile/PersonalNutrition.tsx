/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { getAuth } from 'firebase/auth';
import {
	collection,
	DocumentData,
	getDocs,
	orderBy,
	query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import { db } from '../../firebase.config';

interface NutritionLog {
	ingredients: DocumentData;
	loggedDate: string;
	total: DocumentData;
}

const PersonalNutrition = () => {
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
	};

	const [nutritionLog, setNutritionLog] = useState<NutritionLog[]>([]);

	useEffect(() => {
		const auth = getAuth();
		const getWorkoutLog = async () => {
			const getCollection = collection(
				db,
				'users',
				`${auth.currentUser?.uid}`,
				'nutrition-log',
			);

			const q = query(getCollection, orderBy('loggedDate'));

			const docSnap = await getDocs(q);

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

		getWorkoutLog();
	}, []);

	return (
		<div>
			<ProfileSideBar currentState='nutrition' />
			<div css={styles.container}>
				<div css={styles.workoutOverviewContainer}>
					<p>Nutrition Log</p>
					{nutritionLog.map(nutrition => (
						<div>
							<div>
								<div>{nutrition.loggedDate}</div>
								{Object.values(nutrition.ingredients).map((key, index) => (
									<div key={index}>{key}</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PersonalNutrition;
