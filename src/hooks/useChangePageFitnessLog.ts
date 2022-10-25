import { getAuth } from 'firebase/auth';
import {
	collection,
	DocumentData,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	startAt,
} from 'firebase/firestore';
import { db } from '../firebase.config';

interface LogWorkout {
	name: string;
	loggedDate: string;
	note: string;
}

const useChangePageFitnessLog = () => {
	const nextPage = async (currentPage: number, log: string) => {
		const auth = getAuth();
		const getCollection = collection(
			db,
			'users',
			`${auth.currentUser?.uid}`,
			`${log}`,
		);

		const currentPageQuery = query(
			getCollection,
			orderBy('loggedDate', 'desc'),
			limit(5 + 5 * currentPage),
		);

		const docSnap = await getDocs(currentPageQuery);
		const lastVisible = docSnap.docs[docSnap.docs.length - 1];

		const nextPage = query(
			getCollection,
			orderBy('loggedDate', 'desc'),
			startAfter(lastVisible),
			limit(5),
		);

		const result = await getDocs(nextPage);

		const nutritionLogRef: LogWorkout[] = [];

		result.forEach(doc => {
			return nutritionLogRef.push({
				name: doc.data().name,
				loggedDate: `${doc.data().loggedDate.toDate()}`,
				note: doc.data().note,
			});
		});

		return nutritionLogRef;
	};

	const prevPage = async (currentPage: number, log: string) => {
		const auth = getAuth();
		const getCollection = collection(
			db,
			'users',
			`${auth.currentUser?.uid}`,
			`${log}`,
		);

		if (currentPage <= 0) {
			const firstPageQuery = query(
				getCollection,
				orderBy('loggedDate', 'desc'),
				limit(5),
			);

			const docSnap = await getDocs(firstPageQuery);

			const nutritionLogRef: LogWorkout[] = [];

			docSnap.forEach(doc => {
				return nutritionLogRef.push({
					name: doc.data().name,
					loggedDate: `${doc.data().loggedDate.toDate()}`,
					note: doc.data().note,
				});
			});

			return nutritionLogRef;
		}

		const currentPageQuery = query(
			getCollection,
			orderBy('loggedDate', 'desc'),
			limit(5 + 5 * currentPage),
		);

		const docSnap = await getDocs(currentPageQuery);
		const start = docSnap.docs[docSnap.docs.length - 6];

		const prevPage = query(
			getCollection,
			orderBy('loggedDate', 'desc'),
			startAfter(start),
			limit(5),
		);

		const test = await getDocs(prevPage);

		const nutritionLogRef: LogWorkout[] = [];

		test.forEach(doc => {
			return nutritionLogRef.push({
				name: doc.data().name,
				loggedDate: `${doc.data().loggedDate.toDate()}`,
				note: doc.data().note,
			});
		});

		return nutritionLogRef;
	};

	return { nextPage, prevPage };
};

export default useChangePageFitnessLog;
