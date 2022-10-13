import { useState } from 'react';

interface Error {
	active: boolean;
	message: string;
}

export function useError() {
	const [error, setError] = useState<Error>({ active: false, message: '' });

	return {
		error,
		setError,
	};
}
