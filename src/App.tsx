/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Profile/Overview';
import PersonalInfo from './components/profileOverview/PersonalInfo';
import PersonalNutrition from './pages/Profile/PersonalNutrition';
import PersonalFitness from './pages/Profile/PesrsonalFitness';
import PrivateRoute from './components/privateRoutes/PrivateRoute';
import PageNotFound from './pages/PageNotFound';
import LoggedInRoute from './components/privateRoutes/LoggedInRoute';

function App() {
	return (
		<Router>
			<Global
				styles={css`
					${emotionReset}
					body {
						font-family: 'Roboto Condensed', sans-serif;
						margin-top: 81px;
						background-color: #f3f3f4;
					}
					*,
					*::after,
					*::before {
						box-sizing: border-box;
						-moz-osx-font-smoothing: grayscale;
						-webkit-font-smoothing: antialiased;
					}
				`}
			/>
			<Navbar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<LoggedInRoute />}>
					<Route path='/login' element={<Login />} />
				</Route>
				<Route path='/register' element={<LoggedInRoute />}>
					<Route path='/register' element={<Register />} />
				</Route>
				<Route path='/profile' element={<PrivateRoute />}>
					<Route path='/profile/overview' element={<Overview />} />
					<Route path='/profile/nutrition' element={<PersonalNutrition />} />
					<Route path='/profile/fitness' element={<PersonalFitness />} />
					<Route path='/profile/personal-info' element={<PersonalInfo />} />
				</Route>
				<Route path='/*' element={<PageNotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
