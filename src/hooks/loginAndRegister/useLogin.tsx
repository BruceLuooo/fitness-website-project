import { useState } from 'react';

interface login {
	email: string;
	password: string;
}

export const useLogin = () => {
	const [loginInfo, setLoginInfo] = useState<login>({
		email: '',
		password: '',
	});

	const updateLoginInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const isLoginFormCompleted = (loginInfo: login) => {
		return loginInfo.email === '' || loginInfo.password === '';
	};

	return { loginInfo, updateLoginInfo, isLoginFormCompleted };
};
