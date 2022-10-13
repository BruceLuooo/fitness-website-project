import React from 'react';

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

interface Props {
	data: Data[];
}

function DisplaySearchedRecipies({ data }: Props) {
	return <div>DisplaySearchedRecipies</div>;
}

export default DisplaySearchedRecipies;
