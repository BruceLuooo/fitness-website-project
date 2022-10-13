import { useState } from 'react';

export function usePopup() {
	const [popup, setPopup] = useState(false);

	return { popup, setPopup };
}
