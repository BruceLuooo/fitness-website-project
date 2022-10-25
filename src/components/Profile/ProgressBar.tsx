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
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		container: css`
			position: relative;
			${mq2} {
				width: 23rem;
			}
		`,
	};

	const percentage = (completedDays / totalDays) * 100;

	return (
		<div css={styles.container}>
			<CircularProgressbar
				value={percentage}
				text={`${completedDays} / ${totalDays}`}
			/>
		</div>
	);
};

export default ProgressBar;
