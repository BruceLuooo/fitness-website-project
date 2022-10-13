/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FunctionComponent } from 'react';

interface Options {
	label: string;
	value?: number;
}

interface Props {
	selectOptions: Options[];
	onSelectedOption: Function;
}

const DropdownMenu: FunctionComponent<Props> = ({
	selectOptions,
	onSelectedOption,
}) => {
	const styles = {
		dropdownContainer: css`
			position: relative;
			width: 50%;
			background-color: white;
		`,
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
			border: 1px solid #ccc;
			border-radius: 5px;
			width: 25rem;
			overflow: auto;
			max-height: 150px;
			background-color: white;
			z-index: 10;
		`,
		dropdownitem: css`
			padding: 5px;
			cursor: pointer;
			&:hover {
				background-color: #9fc3f870;
			}
		`,
	};

	return (
		<div css={styles.dropdownContainer}>
			<div css={styles.dropdownMenu}>
				{selectOptions.map((option: any, index) => (
					<div
						key={index}
						css={styles.dropdownitem}
						onClick={() => onSelectedOption(option.label, option.value)}
					>
						{option.label}
					</div>
				))}
			</div>
		</div>
	);
};

export default DropdownMenu;
