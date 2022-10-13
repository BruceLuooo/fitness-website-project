/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import show from '../assets/showPassword.png';
import hide from '../assets/hidePassword.png';
import { useNavigate } from 'react-router-dom';
import { useError } from '../hooks/useError';

const Login = () => {
	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			max-width: 40%;
			margin: auto;
			margin-top: 10rem;
			padding: 5rem;
			gap: 2rem;
			border: 1px solid lightgray;
			border-radius: 4px;
		`,
		logoFont: css`
			color: black;
			font-size: 30px;
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			gap: 1rem;
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
			font-size: 16px;
		`,
		invalidLogin: css`
			color: #dc0909;
		`,
		button: css`
			font-size: 16px;
			padding: 0.5rem 1rem;
			background-color: white;
			border: 1px solid lightgray;
			border-radius: 4px;
			transition: 0.2s;
			&:hover {
				cursor: pointer;
				background-color: #cecece;
			}
		`,
		showPassword: css`
			position: absolute;
			right: 1rem;
			top: 2rem;
		`,
	};

	const { error, setError } = useError();
	const navigate = useNavigate();

	interface login {
		login: string;
		password: string;
	}

	const [loginInfo, setLoginInfo] = useState<login>({
		login: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (loginInfo.login === '' || loginInfo.password === '') {
			return setError({ active: true, message: 'Please fill in all fields' });
		}

		setError({ active: false, message: '' });
		return navigate('/profile');
	};

	return (
		<div css={styles.container}>
			<div css={styles.logoFont}>Sign Into Your Account</div>
			<form css={styles.formContainer} onSubmit={onSubmit}>
				<div css={styles.input}>
					<label htmlFor='login'>Username</label>
					<input
						css={styles.inputBox}
						id='login'
						type='text'
						onChange={onChange}
					/>
				</div>
				<div css={styles.input}>
					<label htmlFor='password'>Password</label>
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
