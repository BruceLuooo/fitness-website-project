/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import DisplayNutritionalData from './DisplayNutritionalData';
import DownArrow from '../../assets/svg/downArrow.svg';
import redX from '../../assets/redx.png';
import axios from 'axios';
import useDelay from '../../hooks/useDelay';
import LoadingSpinner from '../LoadingSpinner';

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
		SUGAR?: {
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
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		fontColor: css`
			color: black;
		`,
		h1: css`
			font-size: 32px;
			font-weight: 600;
			${mq1} {
				font-size: 40px;
			}
			${mq2} {
				font-size: 30px;
			}
		`,
		container: css`
			display: flex;
			flex-direction: column;
			gap: 2rem;
			padding: 3rem;
			margin: 0 1rem;
			background-color: white;
			box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
				0 10px 10px rgba(0, 0, 0, 0.22);
			border-radius: 6px;
			min-width: 70rem;
			${mq1} {
				min-width: unset;
				align-items: center;
			}
			${mq2} {
				padding: 1rem;
				align-items: unset;
			}
		`,
		mainContainer: css`
			display: flex;
			justify-content: space-around;
			gap: 2rem;
			${mq1} {
				flex-direction: column;
				max-width: 50rem;
				width: 100%;
				align-items: center;
			}
			${mq2} {
				padding: 0;
				align-items: unset;
			}
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			border: 2px solid #eeedf3;
			padding: 2rem;
			border-radius: 6px;
			${mq2} {
				gap: 1.5rem;
				padding: 1rem;
			}
		`,
		displaySpinnerContainer: css`
			border-radius: 6px;
			background-color: whitesmoke;
			padding: 1rem 10rem;
			${mq2} {
				padding: 1rem;
			}
		`,
		formInput: css`
			display: flex;
			align-items: center;
			gap: 1rem;
			padding: 0.5rem;
			${mq2} {
				padding: 0;
			}
		`,
		label: css`
			font-size: 16px;
			${mq2} {
				font-size: 15px;
			}
		`,
		inputStructure: css`
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		`,
		dropdownContainer: css`
			text-align: left;
			position: relative;
		`,
		input: css`
			background-color: white;
			padding: 5px;
			display: flex;
			max-width: 10rem;
			width: 100%;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			border-radius: 5px;
			font-size: 16px;
			${mq2} {
				max-width: 10rem;
				font-size: 14px;
			}
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
			${mq2} {
				width: 70%;
			}
		`,
		dropdownInput: css`
			width: 6rem;
			${mq2} {
				width: 3rem;
			}
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
			padding-top: 26px;

			width: 18px;
			${mq2} {
				width: 16px;
			}
		`,
		deleteIcon: css`
			border: none;

			&:hover {
				cursor: pointer;
			}
			${mq2} {
				transform: translateX(-22px);
			}
		`,
		formButtonsContainer: css`
			display: flex;
			padding: 0.5rem;
			width: 70%;
			gap: 0.5rem;
			${mq2} {
				padding: 0.5rem 0rem;
			}
		`,
		button: css`
			background-color: #7caafa;
			border: none;
			box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
			width: 6rem;
			height: 2.5rem;
			font-size: 14px;
			color: white;
			border-radius: 5px;
			transition: 0.3s;
			&:hover {
				cursor: pointer;
				background-color: #4f8efb;
			}
			${mq2} {
				min-width: 7rem;
				font-size: 16px;
				height: 2.5rem;
			}
		`,
	};

	const { loading, setLoading, delay } = useDelay();

	useEffect(() => {
		const handler = () => setShowMenu(false);

		window.addEventListener('click', handler);
	}, []);

	const [ingredients, setIngredients] = useState<Information[]>([
		{ id: 1, name: '', quantity: 0, metrics: '' },
	]);
	const [addIngredient, setAddIngredient] = useState(2);
	const [showMenu, setShowMenu] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [nutritionData, setNutritionData] = useState<Data[]>([]);

	const selectOptions = [
		{ value: '', label: '' },
		{ value: 'g', label: 'g' },
		{ value: 'oz', label: 'oz' },
		{ value: 'lbs', label: 'lbs' },
		{ value: 'ml', label: 'ml' },
		{ value: 'L', label: 'L' },
	];

	//Opens selected dropdown menu
	const openDropdownMenu = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
	) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
		setCurrentIndex(index);
	};

	//Updates metrics property of selected ingredient found in ingredients useState
	const selectMetric = (id: number, option: string) => {
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

	//Updates name property of selected ingredient found in ingredients useState
	const updateIngredientListState = (
		e: React.ChangeEvent<HTMLInputElement>,
		id: number,
	) => {
		setIngredients(prev =>
			prev.map(ingredient => {
				if (ingredient.id === id) {
					return { ...ingredient, [e.target.id]: e.target.value };
				}
				return ingredient;
			}),
		);
	};

	//Adds a new object to ingridents useState
	const addNewIngredient = () => {
		setAddIngredient(addIngredient + 1);
		setIngredients(prevState => [
			...prevState,
			{ id: addIngredient, name: '', quantity: 0, metrics: '' },
		]);
	};

	//Removes selected object from ingridents useState
	const removeIngredient = (id: number, name: string) => {
		const filteredIngredients = ingredients.filter(
			ingredient => ingredient.id !== id,
		);
		setIngredients(filteredIngredients);
		setNutritionData([]);
	};

	// API Post request to get data of all ingrients and saved to dataRecieved useState
	const onSubmitForm = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		removeOldData();

		// Joins all the ingridents into a string that is accepted and readable by the api
		const formattedIngredientInformation = ingredients.map(ingredient => {
			return `${ingredient.quantity + ingredient.metrics} ${ingredient.name}`;
		});

		formattedIngredientInformation.map(async ingredient => {
			try {
				const config = {
					method: 'POST',
					url: `https://api.edamam.com/api/nutrition-details?app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`,
					data: {
						ingr: [ingredient],
					},
				};

				await axios.request(config).then(({ data }) => {
					if (data.status === 555) return;

					setNutritionData(prev => [
						...prev,
						{
							name: ingredient,
							calories: data.calories,
							totalNutrients: {
								FAT: {
									quantity: data.totalNutrients.FAT.quantity,
									unit: data.totalNutrients.FAT.unit,
								},
								SUGAR: {
									quantity: data.totalNutrients.SUGAR?.quantity,
									unit: data.totalNutrients.SUGAR?.unit,
								},
								PROCNT: {
									quantity: data.totalNutrients.PROCNT.quantity,
									unit: data.totalNutrients.PROCNT.unit,
								},
							},
						},
					]);
				});
			} catch (error) {
				return;
			}
		});

		await delay(2000);
		setLoading(false);
	};
	const removeOldData = () => {
		setLoading(true);
		setNutritionData([]);
	};

	return (
		<div css={styles.container}>
			<h1 css={[styles.h1, styles.fontColor]}>
				Search Nutritional Data To Log
			</h1>
			<div css={styles.mainContainer}>
				<form onSubmit={onSubmitForm} css={styles.formContainer}>
					{ingredients.map(ingredient => (
						<div key={ingredient.id} css={styles.formInput}>
							<div css={styles.inputStructure}>
								<label htmlFor='name' css={[styles.label, styles.fontColor]}>
									Ingridient
								</label>
								<input
									css={styles.input}
									id='name'
									type='text'
									placeholder='ex. chicken breast'
									required
									onChange={e => updateIngredientListState(e, ingredient.id)}
								/>
							</div>
							<div css={styles.inputStructure}>
								<label
									htmlFor='quantity'
									css={[styles.label, styles.fontColor]}
								>
									Quantity
								</label>
								<input
									css={styles.input}
									id='quantity'
									type='number'
									placeholder='ex. 1'
									required
									onChange={e => updateIngredientListState(e, ingredient.id)}
								/>
							</div>
							<div css={[styles.dropdownContainer, styles.inputStructure]}>
								<label css={[styles.label, styles.fontColor]}>(Optional)</label>
								<div
									css={[styles.input, styles.dropdownInput]}
									onClick={e => openDropdownMenu(e, ingredient.id)}
								>
									<span>
										{ingredient.metrics === '' ? '' : `${ingredient.metrics}`}
									</span>
									<img src={DownArrow} alt='' css={styles.icon} />
								</div>
								{ingredient.id === currentIndex && showMenu === true && (
									<div css={styles.dropdownMenu}>
										{selectOptions.map(option => (
											<div
												key={option.value}
												css={styles.dropdownitem}
												onClick={() =>
													selectMetric(ingredient.id, option.value)
												}
											>
												{option.label}
											</div>
										))}
									</div>
								)}
							</div>

							<div
								css={styles.deleteIcon}
								onClick={() => removeIngredient(ingredient.id, ingredient.name)}
							>
								<img css={styles.iconDelete} src={redX} alt='close' />
							</div>
						</div>
					))}
					<div css={styles.formButtonsContainer}>
						<button css={styles.button} onClick={addNewIngredient}>
							+ Ingredient
						</button>
						<button css={styles.button} type='submit'>
							Submit
						</button>
					</div>
				</form>
				<div>
					{loading ? (
						<div css={styles.displaySpinnerContainer}>
							<LoadingSpinner />
						</div>
					) : (
						<DisplayNutritionalData nutritionData={nutritionData} />
					)}
				</div>
			</div>
		</div>
	);
}

export default SearchNutritionInfo;
