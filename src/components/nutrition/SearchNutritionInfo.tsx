/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import DisplayNutritionalData from './DisplayNutritionalData';
import DownArrow from '../../assets/svg/downArrow.svg';
import Trash from '../../assets/svg/trash.svg';
import axios from 'axios';
import FormCompleted from '../FormCompleted';

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
	const mq1 = `@media screen and (max-width: 1283px)`;
	const mq2 = `@media screen and (max-width: 768px)`;

	const styles = {
		h1: css`
			font-size: 50px;
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
			padding: 2rem;
			margin-top: 3rem;
			background-color: whitesmoke;
			min-width: 70rem;
			${mq1} {
				min-width: 50rem;
			}
			${mq2} {
				min-width: 320px;
			}
		`,
		mainContainer: css`
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 0 2rem;
			gap: 3rem;
			${mq1} {
				flex-direction: column;
				align-items: unset;
			}
			${mq2} {
				padding: 0;
			}
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			${mq2} {
				gap: 1.5rem;
			}
		`,
		formInput: css`
			display: flex;
			align-items: center;
			gap: 1.5rem;
			padding: 0.5rem;
			${mq2} {
				padding: 0;
			}
		`,
		label: css`
			font-size: 18px;
			${mq2} {
				font-size: 14px;
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
			width: 10rem;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			border: 1px solid #ccc;
			border-radius: 5px;
			font-size: 16px;
			${mq2} {
				width: 7rem;
				font-size: 16px;
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
			padding-top: 20px;
			width: 18px;
			${mq2} {
				width: 16px;
			}
		`,
		deleteIcon: css`
			background-color: whitesmoke;
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
			height: 2rem;
			background-color: #7caafa;
			border: 1px solid #ccc;
			min-width: 10rem;
			height: 3rem;
			font-size: 16px;
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
	const [dataRecieved, setDataRecived] = useState<Data[]>([]);
	const [successfulPopup, setSucessfulPopup] = useState(false);

	const selectOptions = [
		{ value: '', label: '' },
		{ value: 'g', label: 'g' },
		{ value: 'oz', label: 'oz' },
		{ value: 'lbs', label: 'lbs' },
		{ value: 'ml', label: 'ml' },
		{ value: 'L', label: 'L' },
	];

	//Opens selected dropdown menu
	const handleInputClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number,
	) => {
		e.stopPropagation();
		setShowMenu(!showMenu);
		setCurrentIndex(index);
	};

	//Updates metrics property of selected ingredient found in ingredients useState
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

	//Updates name property of selected ingredient found in ingredients useState
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
		setDataRecived([]);
	};

	// API Post request to get data of all ingrients and saved to dataRecieved useState
	const onSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setDataRecived([]);

		// Joins all the ingridents into a string that is accepted and readable by the api
		const allInformation = ingredients.map(ingredient => {
			return `${ingredient.quantity + ingredient.metrics} ${ingredient.name}`;
		});

		allInformation.map(async information => {
			const { data } = await axios.post(
				`https://api.edamam.com/api/nutrition-details?app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`,
				{
					ingr: [information],
				},
			);

			setDataRecived(prev => [
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
		});
	};

	return (
		<div css={styles.container}>
			<h1 css={styles.h1}>Get Nurtritional Information On Your Meals!</h1>
			<div css={styles.mainContainer}>
				<form onSubmit={onSubmit} css={styles.formContainer}>
					{ingredients.map(ingredient => (
						<div key={ingredient.id} css={styles.formInput}>
							<div css={styles.inputStructure}>
								<label htmlFor='name' css={styles.label}>
									Ingridient Name
								</label>
								<input
									css={styles.input}
									id='name'
									type='text'
									required
									onChange={e => onChange(e, ingredient.id)}
								/>
							</div>
							<div css={styles.inputStructure}>
								<label htmlFor='quantity' css={styles.label}>
									Quantity
								</label>
								<input
									css={styles.input}
									id='quantity'
									type='number'
									required
									onChange={e => onChange(e, ingredient.id)}
								/>
							</div>
							<div css={[styles.dropdownContainer, styles.inputStructure]}>
								<label css={styles.label}>(Optional)</label>
								<div
									css={[styles.input, styles.dropdownInput]}
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
								onClick={() => removeIngredient(ingredient.id, ingredient.name)}
							>
								<img css={styles.iconDelete} src={Trash} alt='close' />
							</button>
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
				{!successfulPopup ? (
					<DisplayNutritionalData
						dataRecieved={dataRecieved}
						setSucessfulPopup={setSucessfulPopup}
					/>
				) : (
					<FormCompleted
						setSucessfulPopup={setSucessfulPopup}
						text='Nutrition'
					/>
				)}
			</div>
		</div>
	);
}

export default SearchNutritionInfo;
