/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import DailyCalorieIntake from '../../components/DailyCalorieIntake';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import ProgressBar from '../../components/Profile/ProgressBar';

const Overview = () => {
	const styles = {
		container: css`
			display: flex;
			flex-direction: column;
			gap: 3rem;
			width: 100%;
		`,
		workoutOverviewContainer: css`
			border: 1px solid black;
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: aliceblue;
			width: 25rem;
			padding: 1.5rem;
		`,
	};

	return (
		<div>
			<ProfileSideBar currentState='overview' />
			<div css={styles.container}>
				<DailyCalorieIntake />
				<div css={styles.workoutOverviewContainer}>
					<p>Monthly Workouts</p>
					<ProgressBar />
					<p>Log A Workout</p>
				</div>
			</div>
		</div>
	);
};

export default Overview;
