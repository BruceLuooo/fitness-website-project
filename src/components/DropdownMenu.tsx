/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FunctionComponent } from 'react';

interface Options {
	label: string;
	value?: number;
}

interface Props {
	selectOptions: Options[];
	update: Function;
}

const DropdownMenu: FunctionComponent<Props> = ({ selectOptions, update }) => {
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		dropdownInput: css`
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			border-radius: 5px;
			text-align: left;
			width: 100%;
		`,
		icon: css`
			width: 15px;
		`,
		dropdownMenu: css`
			position: absolute;
			border: 1px solid blue;
			border-radius: 5px;
			width: 20rem;
			overflow: auto;
			max-height: 150px;
			background-color: white;
			z-index: 10;
			${mq1} {
				width: 14rem;
			}
			${mq2} {
				width: 17rem;
			}
		`,
		dropdownitem: css`
			padding: 5px;
			font-size: 16px;
			cursor: pointer;
			&:hover {
				background-color: #9fc3f870;
			}
			${mq2} {
				font-size: 16px;
			}
		`,
	};

	return (
		<div css={styles.dropdownMenu}>
			{selectOptions.map((option: any, index) => (
				<div
					key={index}
					css={styles.dropdownitem}
					onClick={() => update(option.label, option.value)}
				>
					{option.label}
				</div>
			))}
		</div>
	);
};

export default DropdownMenu;
