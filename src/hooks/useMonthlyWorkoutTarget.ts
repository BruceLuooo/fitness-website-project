import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../firebase.config';

export function useMonthlyWorkoutTarget() {
	const [workoutTarget, setWorkoutTarget] = useState<number>(0);

	const finalResult = async () => {
		const auth = getAuth();

		const docRef = doc(db, `users/${auth.currentUser!.uid}`);
		const docSnap = await getDoc(docRef);

		if (docSnap.data() !== undefined) {
			setWorkoutTarget(docSnap.data()!.workoutsPerMonth);
		}
	};

	finalResult();

	return { workoutTarget, setWorkoutTarget };
}
