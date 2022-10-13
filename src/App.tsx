/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react';
import emotionReset from 'emotion-reset';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Nutrition from './pages/Nutrition';
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Profile/Overview';
import Fitness from './pages/Fitness';
import PersonalInfo from './pages/Profile/PersonalInfo';
import PersonalNutrition from './pages/Profile/PersonalNutrition';
import PersonalFitness from './pages/Profile/PesrsonalFitness';

function App() {
	return (
		<Router>
			<Global
				styles={css`
					${emotionReset}
					body {
						font-family: 'Roboto', sans-serif;
						margin-top: 81px;
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
				<Route path='/nutrition' element={<Nutrition />} />
				<Route path='/fitness' element={<Fitness />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route path='/profile/overview' element={<Overview />} />
				<Route path='/profile/nutrition' element={<PersonalNutrition />} />
				<Route path='/profile/fitness' element={<PersonalFitness />} />
				<Route path='/profile/personal-info' element={<PersonalInfo />} />
			</Routes>
		</Router>
	);
}

export default App;
