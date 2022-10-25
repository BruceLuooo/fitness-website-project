/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SearchExercises from '../components/fitness/SearchExercises';

const Fitness = () => {
	const mq1 = `@media screen and (max-width: 1283px)`;

	const styles = {
		container: css`
			width: 100%;
			padding: 0px 100px;
			${mq1} {
				padding: 0px 25px;
			}
		`,
	};

	return (
		<div css={styles.container}>
			<SearchExercises />
		</div>
	);
};

export default Fitness;
