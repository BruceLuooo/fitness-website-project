/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { usePopup } from '../../hooks/usePopup';
import axios from 'axios';
import DisplaySearchedRecipies from './DisplaySearchedRecipies';

interface SearchQuery {
	name: string;
	diet: string[];
	health: string[];
}

interface Data {
	recipe: {
		label: string;
		image: string;
	};
	healthLabels: string[];
	ingredientLines: string[];
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
	servings: number;
}

function SearchRecipies() {
	const styles = {
		mainContainer: css`
			width: 100%;
			display: flex;
			margin-top: 7rem;
		`,
		formContainer: css`
			display: flex;
			flex-direction: column;
			background-color: aliceblue;
		`,
	};

	const selectOptions = {
		diet: ['balance', 'high-fiber', 'high-protein', 'low-carb', 'low-fat'],
		health: [
			'gluten-free',
			'dairy-free',
			'peanut-free',
			'pork-free',
			'red-meat-free',
			'pescatarian',
		],
	};
	const { popup, setPopup } = usePopup();

	const [searchQuery, setSearchQuery] = useState<SearchQuery>({
		name: '',
		diet: [],
		health: [],
	});
	const [data, setData] = useState<Data[]>([]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(prev => ({
			...prev,
			[e.target.id]: e.target.value,
		}));
	};

	const addFilter = (e: any, value: string) => {
		if (e.target.id === 'diet') {
			if (searchQuery.diet.indexOf(value) < 0) {
				setSearchQuery(prev => ({
					...prev,
					[e.target.id]: [...prev.diet, value],
				}));
			}
		}
		if (e.target.id === 'health') {
			if (searchQuery.health.indexOf(value) < 0) {
				setSearchQuery(prev => ({
					...prev,
					[e.target.id]: [...prev.health, value],
				}));
			}
		}
	};

	const removeFilter = (e: any, value: string) => {
		if (e.target.id === 'diet') {
			const removeSelectedFilter = searchQuery.diet.filter(
				option => option !== value,
			);
			setSearchQuery(prev => ({
				...prev,
				[e.target.id]: removeSelectedFilter,
			}));
		}
		if (e.target.id === 'health') {
			const removeSelectedFilter = searchQuery.health.filter(
				option => option !== value,
			);
			setSearchQuery(prev => ({
				...prev,
				[e.target.id]: removeSelectedFilter,
			}));
		}
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const params = new URLSearchParams();
		searchQuery.diet.forEach(diet => params.append('diet', diet));
		searchQuery.health.forEach(health => params.append('health', health));
		params.append('q', searchQuery.name);
		const { data } = await axios.get(
			`https://api.edamam.com/api/recipes/v2?type=public&app_id=${process.env.REACT_APP_RECIPE_ID}&app_key=${process.env.REACT_APP_RECIPE_KEY}`,
			{ params },
		);

		data.hits.forEach((hit: any) => {
			setData(prev => [
				...prev,
				{
					recipe: {
						label: hit.recipe.label,
						image: hit.recipe.image,
					},
					healthLabels: hit.recipe.healthLabels,

					ingredientLines: hit.recipe.ingredientLines,
					calories: hit.recipe.calories,
					totalNutrients: {
						FAT: {
							quantity: hit.recipe.totalNutrients.FAT.quantity,
							unit: hit.recipe.totalNutrients.FAT.unit,
						},
						SUGAR: {
							quantity: hit.recipe.totalNutrients.SUGAR.quantity,
							unit: hit.recipe.totalNutrients.SUGAR.unit,
						},
						PROCNT: {
							quantity: hit.recipe.totalNutrients.PROCNT.quantity,
							unit: hit.recipe.totalNutrients.PROCNT.unit,
						},
					},
					servings: hit.recipe.yield,
				},
			]);
		});

		setPopup(true);
	};

	return (
		<div css={styles.mainContainer}>
			<form css={styles.formContainer} onSubmit={onSubmit}>
				<div>
					<label htmlFor=''>Search</label>
					<input type='text' id='name' onChange={onChange} />
				</div>
				<div>
					{searchQuery.diet.map(diet => (
						<div key={diet}>
							<button
								type='button'
								id='diet'
								onClick={e => removeFilter(e, diet)}
							>
								- {diet}
							</button>
						</div>
					))}
					{searchQuery.health.map(health => (
						<div key={health}>
							<button
								type='button'
								id='health'
								onClick={e => removeFilter(e, health)}
							>
								- {health}
							</button>
						</div>
					))}
				</div>
				<div>
					{selectOptions.diet.map(diet => (
						<div key={diet}>
							<button type='button' id='diet' onClick={e => addFilter(e, diet)}>
								+ {diet}
							</button>
						</div>
					))}
				</div>
				<div>
					{selectOptions.health.map(health => (
						<div key={health}>
							<button
								type='button'
								id='health'
								onClick={e => addFilter(e, health)}
							>
								+ {health}
							</button>
						</div>
					))}
				</div>
				<button type='submit'>Search</button>
			</form>
			{popup && <DisplaySearchedRecipies data={data} />}
		</div>
	);
}

export default SearchRecipies;
