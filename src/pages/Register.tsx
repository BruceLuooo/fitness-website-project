/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '../hooks/useError';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import show from '../assets/showPassword.png';
import hide from '../assets/hidePassword.png';

interface login {
	name: string;
	lastname: string;
	email: string;
	password: string;
	confirmPassword: string;
	workoutsPerMonth: number;
	caloriesPerDay: number;
}

const Register = () => {
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
			gap: 1.5rem;
		`,
		label: css`
			font-size: 18px;
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
			top: 2.2rem;
		`,
		fullName: css`
			display: grid;
			grid-template-columns: 50% 50%;
		`,
	};

	const { error, setError } = useError();
	const navigate = useNavigate();

	const [registerInfo, setRegisterInfo] = useState<login>({
		name: '',
		lastname: '',
		email: '',
		password: '',
		confirmPassword: '',
		workoutsPerMonth: 0,
		caloriesPerDay: 0,
	});
	const [showPassword, setShowPassword] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRegisterInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (registerInfo.confirmPassword !== registerInfo.password) {
			return setError({ active: true, message: 'passwords do not match' });
		}
		if (
			registerInfo.confirmPassword === '' ||
			registerInfo.lastname === '' ||
			registerInfo.email === '' ||
			registerInfo.name === '' ||
			registerInfo.password === ''
		) {
			return setError({ active: true, message: 'Please fill in all fields' });
		}

		try {
			const auth = getAuth();

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerInfo.email,
				registerInfo.password,
			);
			const user = userCredential.user;
			const token = await user.getIdToken();
			localStorage.setItem('token', token);

			await setDoc(doc(db, 'users', user.uid), registerInfo);
			return navigate('/profile/overview');
		} catch (error) {
			return setError({ active: true, message: 'Could Not Create Account' });
		}
	};

	return (
		<div css={styles.container}>
			<div css={styles.logoFont}>Create Your Account</div>
			<form css={styles.formContainer} onSubmit={onSubmit}>
				<div css={styles.fullName}>
					<div css={styles.input}>
						<label css={styles.label} htmlFor='name'>
							Name
						</label>
						<input
							css={styles.inputBox}
							id='name'
							type='text'
							onChange={onChange}
						/>
					</div>
					<div css={styles.input}>
						<label css={styles.label} htmlFor='lastname'>
							Last name
						</label>
						<input
							css={styles.inputBox}
							id='lastname'
							type='text'
							onChange={onChange}
						/>
					</div>
				</div>

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
				<div css={styles.fullName}>
					<div css={styles.input}>
						<label css={styles.label} htmlFor='name'>
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
					<div css={styles.input}>
						<label css={styles.label} htmlFor='confirmPassword'>
							Confirm Password
						</label>
						<input
							css={styles.inputBox}
							id='confirmPassword'
							type='password'
							onChange={onChange}
						/>
					</div>
				</div>
				<div css={styles.invalidLogin}>
					{error.active && <div>{error.message}</div>}
				</div>
				<div>
					<button type='submit' css={styles.button}>
						Register
					</button>
				</div>
			</form>
			<div>
				Already have an account? Login <a href='/login'>Here</a>
			</div>
		</div>
	);
};

export default Register;
