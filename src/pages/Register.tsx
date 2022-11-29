/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '../hooks/useError';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase.config';
import { setDoc, doc } from 'firebase/firestore';
import { useRegister } from '../hooks/loginAndRegister/useRegister';
import show from '../assets/showPassword.png';
import hide from '../assets/hidePassword.png';

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

	const {
		registerInfo,
		updateRegisterInfo,
		doesPasswordMatch,
		isFormCompleted,
		isPasswordTooShort,
	} = useRegister();

	const { error, setError } = useError();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);

	const register = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (doesPasswordMatch()) {
			return setError({ active: true, message: 'passwords do not match' });
		} else if (isPasswordTooShort()) {
			return setError({
				active: true,
				message: 'Password must be longer than 6 characters',
			});
		} else if (isFormCompleted()) {
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
			sessionStorage.setItem('token', token);

			await setDoc(doc(db, 'users', user.uid), registerInfo);
			return navigate('/profile/overview');
		} catch (error) {
			return setError({ active: true, message: 'Could Not Create Account' });
		}
	};

	return (
		<div css={styles.container}>
			<div css={styles.logoFont}>Create Your Account</div>
			<form css={styles.formContainer} onSubmit={register}>
				<div css={styles.fullName}>
					<div css={styles.input}>
						<label css={styles.label} htmlFor='name'>
							Name
						</label>
						<input
							css={styles.inputBox}
							id='name'
							type='text'
							onChange={updateRegisterInfo}
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
							onChange={updateRegisterInfo}
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
						onChange={updateRegisterInfo}
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
							onChange={updateRegisterInfo}
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
							onChange={updateRegisterInfo}
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
