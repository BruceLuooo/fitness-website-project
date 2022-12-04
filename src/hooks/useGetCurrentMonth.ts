export function useGetCurrentMonth() {
	const getCurrentMonth = () => {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;
		const day = 1;
		const together = [currentYear, currentMonth, day].join('-');
		const currentMonthAndYear = new Date(together);
		return currentMonthAndYear;
	};

	const getPreviousMonthStart = () => {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth();
		const day = 1;
		const together = [currentYear, currentMonth, day].join('-');
		const previousMonth = new Date(together);
		return previousMonth;
	};
	const getPreviousMonthEnd = () => {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth();
		const day = new Date(currentMonth, currentYear, 0).getDate();
		const together = [currentYear, currentMonth, day + 1].join('-');
		const previousMonth = new Date(together);
		return previousMonth;
	};

	return { getCurrentMonth, getPreviousMonthEnd, getPreviousMonthStart };
}
