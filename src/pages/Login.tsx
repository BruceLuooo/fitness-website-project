/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import show from '../assets/showPassword.png';
import hide from '../assets/hidePassword.png';
import { useNavigate } from 'react-router-dom';
import { useError } from '../hooks/useError';
import {
	browserSessionPersistence,
	getAuth,
	setPersistence,
	signInWithEmailAndPassword,
} from 'firebase/auth';

interface login {
	email: string;
	password: string;
}

const Login = () => {
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			width: 30rem;
			margin: auto;
			margin-top: 10rem;
			padding: 5rem;
			gap: 2rem;
			border: 1px solid lightgray;
			border-radius: 4px;
			${mq2} {
				padding: 5rem 1rem;
				width: 23rem;
			}
		`,
		logoFont: css`
			color: black;
			font-size: 40px;
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
		`,
		label: css`
			font-size: 20px;
		`,
		input: css`
			position: relative;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			&:focus {
				border-color: aliceblue;
			}
		`,
		inputBox: css`
			height: 2rem;
			border: 1px solid lightgray;
			padding: 1.2rem 0.5rem;
			border-radius: 3px;
			font-size: 18px;
		`,
		invalidLogin: css`
			color: #dc0909;
			font-size: 18px;
		`,
		button: css`
			background-color: #7caafa;
			border: 1px solid #ccc;
			width: 7rem;
			height: 2.5rem;
			font-size: 18px;
			border-radius: 5px;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
		`,
		showPassword: css`
			position: absolute;
			right: 1rem;
			top: 2.3rem;
		`,
	};

	const { error, setError } = useError();
	const navigate = useNavigate();

	const [loginInfo, setLoginInfo] = useState<login>({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (loginInfo.email === '' || loginInfo.password === '') {
			return setError({ active: true, message: 'Please fill in all fields' });
		}

		const auth = getAuth();

		setPersistence(auth, browserSessionPersistence).then(async () => {
			try {
				const { user } = await signInWithEmailAndPassword(
					auth,
					loginInfo.email,
					loginInfo.password,
				);

				if (user) {
					setError({ active: false, message: '' });
					const token = await user.getIdToken();
					sessionStorage.setItem('token', token);
					navigate('/profile/overview');
				}
			} catch (error) {
				console.log('wrong email/password');
				return setError({ active: true, message: 'Invalid Email/Password' });
			}
		});
	};

	return (
		<div css={styles.container}>
			<div css={styles.logoFont}>Sign Into Your Account</div>
			<form css={styles.formContainer} onSubmit={onSubmit}>
				<div css={styles.input}>
					<label css={styles.label} htmlFor='email'>
						Email
					</label>
					<input
						css={styles.inputBox}
						id='email'
						type='text'
						onChange={onChange}
					/>
				</div>
				<div css={styles.input}>
					<label css={styles.label} htmlFor='password'>
						Password
					</label>
					<input
						css={styles.inputBox}
						id='password'
						type={showPassword ? 'text' : 'password'}
						onChange={onChange}
					/>
					<img
						src={showPassword ? show : hide}
						css={styles.showPassword}
						alt='eye'
						onClick={() => setShowPassword(!showPassword)}
					/>
				</div>
				<div css={styles.invalidLogin}>
					{error.active && <div>{error.message}</div>}
				</div>
				<div>
					<button type='submit' css={styles.button}>
						Login
					</button>
				</div>
			</form>
			<div>
				Don't have an account? Register <a href='/register'>Here</a>
			</div>
		</div>
	);
};

export default Login;
