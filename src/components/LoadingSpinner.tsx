/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';

export default function LoadingSpinner() {
	const spinner = keyframes`
      0% {
    transform: rotate(0deg);
    }
    100% {
    transform: rotate(360deg);
    }
  `;

	const styles = {
		spinnerContainer: css`
			display: grid;
			justify-content: center;
			align-items: center;
			height: 300px;
		`,
		loadingSpinner: css`
			width: 100px;
			height: 100px;
			border: 10px solid #f3f3f3;
			border-top: 10px solid #383636;
			border-radius: 50%;
			animation: ${spinner} 1.5s linear infinite;
		`,
	};

	return (
		<div css={styles.spinnerContainer}>
			<div css={styles.loadingSpinner}></div>
		</div>
	);
}
