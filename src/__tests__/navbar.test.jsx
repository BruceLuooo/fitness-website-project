import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Firebase from './firebase';
import Navbar from '../components/Navbar';
import { authMock } from './setupTests';
Firebase.auth = authMock;

describe('navbar display', () => {
	test('display buttons available when user is not logged-in', () => {
		const { container } = render(
			<Router>
				<Navbar />,
			</Router>,
		);

		const loginLink = container.querySelector('#login');
		expect(loginLink).toBeInTheDocument();
		const demoLink = container.querySelector('#demoLogin');
		expect(demoLink).toBeInTheDocument();

		const profileLink = container.querySelector('#profile');
		expect(profileLink).not.toBeInTheDocument();
		const logoutLink = container.querySelector('#logout');
		expect(logoutLink).not.toBeInTheDocument();

		const hamburgerMenu = container.querySelector('#hamburgerMenu');
		expect(hamburgerMenu).not.toBeVisible();
	});

	test('display buttons available when user is not logged-in', () => {
		render(
			<Router>
				<Navbar />,
			</Router>,
		);

		const loginLink = screen.getByText('Login');
		expect(loginLink).toBeInTheDocument();
		const demoLink = screen.getByText('Demo Login');
		expect(demoLink).toBeInTheDocument();

		// const profileLink = screen.getByText('profile');
		// expect(profileLink).not.toBeInTheDocument();
		// const logoutLink = screen.getByText('logout');
		// expect(logoutLink).not.toBeInTheDocument();

		const hamburgerMenu = screen.getByAltText('hamburger');
		expect(hamburgerMenu).not.toBeVisible();
	});

	test('display buttons available when user is logged-in', () => {
		sessionStorage.setItem('token', '123456');

		const { container } = render(
			<Router>
				<Navbar />,
			</Router>,
		);

		const loginLink = container.querySelector('#login');
		expect(loginLink).not.toBeInTheDocument();
		const demoLink = container.querySelector('#demoLogin');
		expect(demoLink).not.toBeInTheDocument();

		const profileLink = container.querySelector('#profile');
		expect(profileLink).toBeInTheDocument();
		const logoutLink = container.querySelector('#logout');
		expect(logoutLink).toBeInTheDocument();

		const hamburgerMenu = container.querySelector('#hamburgerMenu');
		expect(hamburgerMenu).not.toBeVisible();
	});

	// test('display new button options when user is logged-in by clicking demo login', async () => {
	// 	render(
	// 		<Router>
	// 			<Navbar />,
	// 		</Router>,
	// 	);

	// 	const button = screen.getByText('Logout');
	// 	fireEvent.click(button);
	// 	expect(Firebase.auth().signOut).toHaveBeenCalled();
	// });

	// test('display hamburger Menu when screen width is 1283px', () => {
	// 	global.innerWidth = 500;
	// 	render(
	// 		<Router>
	// 			<Navbar />,
	// 		</Router>,
	// 	);

	// 	const hamburgerMenu = screen.getByAltText('hamburger');
	// 	expect(hamburgerMenu).toBeVisible();
	// });
});
