/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';
import PersonalInfo from '../../components/profileOverview/PersonalInfo';
import MonthlyWorkouts from '../../components/profileOverview/MonthlyWorkouts';
import MonthlyCalories from '../../components/profileOverview/MonthlyCalories';

const Overview = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		sideBar: css`
			max-width: 800px;
			width: 100%;
			margin: auto;
		`,
		container: css`
			display: flex;
			flex-direction: column;
			padding-top: 4rem;
			max-width: 80%;
			margin: auto;
			gap: 3rem;
			width: 100%;
			border-left: 4px solid white;
			${mq1} {
				max-width: 95%;
			}
			${mq2} {
				border-left: unset;
				padding-top: 2rem;
			}
		`,
		overview: css`
			display: flex;
			height: 30rem;
			margin: auto;
			padding: 2rem 0 0 8rem;
			gap: 1.5rem;
			margin: 0 1rem;
			background-color: white;
			border-radius: 6px;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			${mq1} {
				flex-direction: column;
				align-items: center;
				height: unset;
				padding: 1rem;
				margin: 0;
			}
			${mq2} {
				width: 100%;
			}
		`,
		line: css`
			width: 4px;
			height: 95%;
			background-color: black;
			${mq1} {
				display: none;
			}
		`,
	};

	return (
		<div>
			<div css={styles.sideBar}>
				<ProfileSideBar currentState='overview' />
			</div>
			<div css={styles.container}>
				<div css={styles.overview}>
					<MonthlyWorkouts />
					<hr css={styles.line} />
					<MonthlyCalories />
				</div>
				<PersonalInfo />
			</div>
		</div>
	);
};

export default Overview;
