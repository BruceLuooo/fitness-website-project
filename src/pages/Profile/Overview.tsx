/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import DailyCalorieIntake from '../../components/DailyCalorieIntake';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';

const Overview = () => {
	return (
		<div>
			<ProfileSideBar currentState='overview' />
			<DailyCalorieIntake />
		</div>
	);
};

export default Overview;
