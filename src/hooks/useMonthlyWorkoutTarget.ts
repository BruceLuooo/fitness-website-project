import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../firebase.config';

export function useMonthlyWorkoutTarget() {
	const [workoutTarget, setWorkoutTarget] = useState<number>(0);
	const auth = getAuth();

	const currentWorkoutTarget = async () => {
		const docRef = doc(db, `users/${auth.currentUser!.uid}`);
		const docSnap = await getDoc(docRef);

		setWorkoutTarget(docSnap.data()!.workoutsPerMonth);
	};

	currentWorkoutTarget();

	const changeWorkoutTarget = async (target: string) => {
		const docRef = doc(db, `users/${auth.currentUser!.uid}`);
		await updateDoc(docRef, {
			workoutsPerMonth: target,
		});

		const docSnap = await getDoc(docRef);

		setWorkoutTarget(docSnap.data()!.workoutsPerMonth);
	};

	return { workoutTarget, changeWorkoutTarget };
}
