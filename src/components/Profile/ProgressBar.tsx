/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
	totalDays: number;
	completedDays: number;
}

const ProgressBar: FC<Props> = ({ totalDays, completedDays }) => {
	const percentage = (completedDays / totalDays) * 100;

	return (
		<div>
			<CircularProgressbar
				value={percentage === NaN ? 0 : percentage}
				text={`${completedDays} / ${totalDays}`}
			/>
		</div>
	);
};

export default ProgressBar;
