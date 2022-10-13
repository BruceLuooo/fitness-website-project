/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { usePopup } from '../../hooks/usePopup';
import DisplayNutritionalData from './DisplayNutritionalData';
import DownArrow from '../../assets/svg/downArrow.svg';
import Xicon from '../../assets/svg/red-x-icon.svg';
import axios from 'axios';

interface Information {
	id: number;
	name: string;
	quantity: number;
	metrics: string;
}

interface Data {
	name: string;
	calories: number;
	totalNutrients: {
		FAT: {
			quantity: number;
			unit: string;
		};
		SUGAR: {
			quantity: number;
			unit: string;
		};
		PROCNT: {
			quantity: number;
			unit: string;
		};
	};
}

function SearchNutritionInfo() {
	const styles = {
		mainContainer: css`
			width: 100%;
			display: flex;
			margin-top: 7rem;
		`,
		label: css`
			font-size: small;
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			background-color: aliceblue;
		`,
		formInput: css`
			display: flex;
			gap: 0.5rem;
			padding: 0.5rem;
			align-items: center;
		`,
		input: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		`,
		dropdownContainer: css`
			text-align: left;
			position: relative;
			width: 30%;
		`,
		dropdownInput: css`
			background-color: white;
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			border-radius: 5px;
		`,
		dropdownMenu: css`
			position: absolute;
			transform: translateY(52px);
			width: 100%;
			border: 1px solid #ccc;
			border-radius: 5px;
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
		icon: css`
			width: 15px;
		`,
		iconDelete: css`
			padding-top: 20px;
			width: 23px;
		`,
		deleteIcon: css`
			border: none;
			background-color: aliceblue;
			&:hover {
				cursor: pointer;
			}
		`,
		formButtonsContainer: css`
			display: flex;
			flex-direction: column;
			padding: 0.5rem;
			width: 100%;
			gap: 0.5rem;
		`,
		button: css`
			background-color: #14dc14;
			border: none;
			height: 32px;
			border-radius: 10px;
			font-size: 14px;
			&:hover {
				cursor: pointer;
			}
		`,
	};

	const { popup, setPopup } = usePopup();

	useEffect(() => {
		const handler = () => setShowMenu(false);

		window.addEventListener('click', handler);
	});

	const [ingredients, setIngredients] = useState<Information[]>([
		{ id: 1, name: '', quantity: 0, metrics: '' },
	]);
	const [addIngredient, setAddIngredient] = useState(2);
	const [showMenu, setShowMenu] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [dataRecieved, setDataRecived] = useState<Data[]>([
		{
			name: '',
			calories: 0,
			totalNutrients: {
				FAT: {
					quantity: 0,
					unit: '',
				},
				SUGAR: {
					quantity: 0,
					unit: '',
				},
				PROCNT: {
					quantity: 0,
					unit: '',
				},
			},
		},
	]);

	const selectOptions = [
		{ value: '', label: '' },
		{ value: 'g', label: 'g' },
		{ value: 'oz', label: 'oz' },
		{ value: 'lbs', label: 'lbs' },
		{ value: 'ml', label: 'ml' },
		{ value: 'L', label: 'L' },
	];

	const handleInputClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
	) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
		setCurrentIndex(index);
	};

	const onSelectedMetric = (id: number, option: string) => {
		setIngredients(prev =>
			prev.map(ingredients => {
				if (ingredients.id === id) {
					return {
						...ingredients,
						metrics: option,
					};
				}
				return ingredients;
			}),
		);
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
		setIngredients(prev =>
			prev.map(ingredient => {
				if (ingredient.id === id) {
					return { ...ingredient, [e.target.id]: e.target.value };
				}
				return ingredient;
			}),
		);
	};

	const addNewIngredient = () => {
		setAddIngredient(addIngredient + 1);
		setIngredients(prevState => [
			...prevState,
			{ id: addIngredient, name: '', quantity: 0, metrics: '' },
		]);
		setPopup(false);
	};

	const removeIngredient = (id: number) => {
		const filteredIngredients = ingredients.filter(
			ingredient => ingredient.id !== id,
		);
		setPopup(false);
		setIngredients(filteredIngredients);
	};

	const onSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setDataRecived([]);

		const allInformation = ingredients.map(ingredient => {
			return `${ingredient.quantity + ingredient.metrics} ${ingredient.name}`;
		});

		allInformation.map(async information => {
			try {
				const { data } = await axios.post(
					`https://api.edamam.com/api/nutrition-details?app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`,
					{
						ingr: [information],
					},
				);

				return setDataRecived(prev => [
					...prev,
					{
						name: information,
						calories: data.calories,
						totalNutrients: {
							FAT: {
								quantity: data.totalNutrients.FAT.quantity,
								unit: data.totalNutrients.FAT.unit,
							},
							SUGAR: {
								quantity: data.totalNutrients.SUGAR.quantity,
								unit: data.totalNutrients.SUGAR.unit,
							},
							PROCNT: {
								quantity: data.totalNutrients.PROCNT.quantity,
								unit: data.totalNutrients.PROCNT.unit,
							},
						},
					},
				]);
			} catch {
				return;
			}
		});
		setPopup(true);
	};

	return (
		<div css={styles.mainContainer}>
			<div css={styles.formContainer}>
				<form onSubmit={onSubmit} css={styles.formContainer}>
					{ingredients.map(ingredient => (
						<div key={ingredient.id} css={styles.formInput}>
							<div css={styles.input}>
								<label htmlFor='name' css={styles.label}>
									Food / Ingridient Name
								</label>
								<input
									id='name'
									type='text'
									required
									onChange={e => onChange(e, ingredient.id)}
								/>
							</div>
							<div css={styles.input}>
								<label htmlFor='quantity' css={styles.label}>
									Quantity
								</label>
								<input
									id='quantity'
									type='number'
									required
									onChange={e => onChange(e, ingredient.id)}
								/>
							</div>
							<div css={[styles.dropdownContainer, styles.input]}>
								<label css={styles.label}>(Optional)</label>
								<div
									css={styles.dropdownInput}
									onClick={e => handleInputClick(e, ingredient.id)}
								>
									<div>
										{ingredient.metrics === '' ? '' : `${ingredient.metrics}`}
									</div>
									<img src={DownArrow} alt='' css={styles.icon} />
								</div>
								{ingredient.id === currentIndex && showMenu === true && (
									<div css={styles.dropdownMenu}>
										{selectOptions.map(option => (
											<div
												key={option.value}
												css={styles.dropdownitem}
												onClick={() =>
													onSelectedMetric(ingredient.id, option.value)
												}
											>
												{option.label}
											</div>
										))}
									</div>
								)}
							</div>

							<button
								css={styles.deleteIcon}
								onClick={() => removeIngredient(ingredient.id)}
							>
								<img css={styles.iconDelete} src={Xicon} alt='close' />
							</button>
						</div>
					))}
					<div css={styles.formButtonsContainer}>
						<button css={styles.button} onClick={addNewIngredient}>
							+ Ingredient
						</button>
						<button css={styles.button} type='submit'>
							Get Nutritional Info
						</button>
					</div>
				</form>
			</div>
			{popup && <DisplayNutritionalData data={dataRecieved} />}
		</div>
	);
}

export default SearchNutritionInfo;
