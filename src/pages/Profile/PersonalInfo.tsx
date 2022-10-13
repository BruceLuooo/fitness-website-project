/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import ProfileSideBar from '../../components/Profile/ProfileSideBar';

const PersonalInfo = () => {
	const styles = {
		mainContainer: css``,
	};

	return <ProfileSideBar currentState='personal-info' />;
};

export default PersonalInfo;
