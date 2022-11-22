import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';

const LoggedInRoute = () => {
	const { loggedIn, checkingStatus } = useAuthStatus();

	if (checkingStatus) {
		return <p></p>;
	}

	return !loggedIn ? <Outlet /> : <Navigate to='/' />;
};

export default LoggedInRoute;
