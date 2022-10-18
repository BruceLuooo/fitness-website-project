/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import {
	EmailAuthProvider,
	updateEmail,
	updatePassword,
	reauthenticateWithCredential,
	getAuth,
} from 'firebase/auth';
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import show from '../../assets/showPassword.png';
import hide from '../../assets/hidePassword.png';

const PersonalInfo = () => {
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
		invalid: css`
			color: #dc0909;
		`,
		valid: css`
			color: #18dc18;
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

	const auth = getAuth();

	const [userInfo, setUserInfo] = useState<DocumentData>({
		name: '',
		lastname: '',
		email: '',
		password: '',
	});
	const [oldUserInfo, setOldUserInfo] = useState<DocumentData>({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [popupMessage, setPopupMessage] = useState({ type: '', message: '' });

	useEffect(() => {
		const fetchUserData = async () => {
			const docRef = doc(db, 'users', auth.currentUser!.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const data = docSnap.data();

				setUserInfo({
					name: data.name,
					lastname: data.lastname,
					email: data.email,
					password: data.password,
				});

				setOldUserInfo({ email: data.email, password: data.password });
			}
		};
		fetchUserData();
	}, []);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserInfo(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (userInfo.name === '') {
			return setPopupMessage({
				type: 'invalid',
				message: 'Please fill in all fields',
			});
		}

		try {
			const docRef = doc(db, 'users', auth.currentUser!.uid);
			setDoc(docRef, userInfo);

			if (userInfo.password !== oldUserInfo.password) {
				const credential = EmailAuthProvider.credential(
					auth.currentUser!.email!,
					oldUserInfo.password,
				);
				await reauthenticateWithCredential(auth.currentUser!, credential);

				updatePassword(auth.currentUser!, userInfo.password);
			}
			if (userInfo.email !== oldUserInfo.email) {
				const credential = EmailAuthProvider.credential(
					auth.currentUser!.email!,
					oldUserInfo.password,
				);
				await reauthenticateWithCredential(auth.currentUser!, credential);

				updateEmail(auth.currentUser!, userInfo.email);
			}
			setPopupMessage({ type: 'success', message: 'Profile Updated' });
		} catch (error) {
			setPopupMessage({ type: 'invalid', message: 'Something went wrong' });
		}
	};

	return (
		<div>
			<ProfileSideBar currentState='personal-info' />
			<div css={styles.container}>
				<div css={styles.logoFont}>My Profile</div>
				<form css={styles.formContainer} onSubmit={onSubmit}>
					<div css={styles.input}>
						<label htmlFor='name'>Name</label>
						<input
							css={styles.inputBox}
							id='name'
							type='text'
							value={userInfo.name}
							onChange={onChange}
						/>
					</div>
					<div css={styles.input}>
						<label htmlFor='lastname'>Lastname</label>
						<input
							css={styles.inputBox}
							id='lastname'
							type='text'
							value={userInfo.lastname}
							onChange={onChange}
						/>
					</div>
					<div css={styles.input}>
						<label htmlFor='email'>Email</label>
						<input
							css={styles.inputBox}
							id='email'
							type='text'
							value={userInfo.email}
							onChange={onChange}
						/>
					</div>
					<div css={styles.input}>
						<label htmlFor='password'>Password</label>
						<input
							css={styles.inputBox}
							id='password'
							type={showPassword ? 'text' : 'password'}
							value={userInfo.password}
							onChange={onChange}
						/>
						<img
							src={showPassword ? show : hide}
							css={styles.showPassword}
							alt='eye'
							onClick={() => setShowPassword(!showPassword)}
						/>
					</div>
					<div>
						{popupMessage.type === 'success' && (
							<div css={styles.valid}>{popupMessage.message}</div>
						)}
						{popupMessage.type === 'invalid' && (
							<div css={styles.invalid}>{popupMessage.message}</div>
						)}
					</div>
					<div>
						<button type='submit' css={styles.button}>
							Update Profile
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PersonalInfo;
