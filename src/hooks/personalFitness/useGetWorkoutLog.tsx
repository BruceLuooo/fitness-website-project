import { getAuth } from 'firebase/auth';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../firebase.config';

interface LogWorkout {
	name: string;
	loggedDate: string;
	note: string;
}

export const useGetWorkoutLog = () => {
	const [workoutLog, setWorkoutLog] = useState<LogWorkout[]>([]);
	const [totalPages, setTotalPages] = useState(0);

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
	const convertDate = (timeStamp: Date) => {
		let date = new Date(timeStamp);
		return `${date.toDateString()} ${date.toLocaleTimeString()}`;
	};

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

	return {
		setWorkoutLog,
		getWorkoutLog,
		getTotalPages,
		workoutLog,
		totalPages,
	};
};
