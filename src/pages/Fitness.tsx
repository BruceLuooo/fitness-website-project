/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SearchExercises from '../components/fitness/SearchExercises';

const Fitness = () => {
	const styles = {
		container: css`
			width: 100%;
			padding: 0px 100px;
		`,
	};

	return (
		<div css={styles.container}>
			<SearchExercises />
		</div>
	);
};

export default Fitness;
