import { useState } from 'react';

interface login {
	name: string;
	lastname: string;
	email: string;
	password: string;
	confirmPassword: string;
	workoutsPerMonth: number;
	caloriesPerDay: number;
}

export const useRegister = () => {
	const [registerInfo, setRegisterInfo] = useState<login>({
		name: '',
		lastname: '',
		email: '',
		password: '',
		confirmPassword: '',
		workoutsPerMonth: 0,
		caloriesPerDay: 0,
	});

	const updateRegisterInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegisterInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const doesPasswordMatch = () => {
		return registerInfo.confirmPassword !== registerInfo.password;
	};

	const isPasswordTooShort = () => {
		return registerInfo.password.length <= 6;
	};

	const isFormCompleted = () => {
		return (
			registerInfo.confirmPassword === '' ||
			registerInfo.lastname === '' ||
			registerInfo.email === '' ||
			registerInfo.name === '' ||
			registerInfo.password === ''
		);
	};

	return {
		registerInfo,
		updateRegisterInfo,
		isFormCompleted,
		doesPasswordMatch,
		isPasswordTooShort,
	};
};
