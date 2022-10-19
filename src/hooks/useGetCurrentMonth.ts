export function useGetCurrentMonth() {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const day = 1;
	const together = [currentYear, currentMonth, day].join('-');
	const currentMonthAndYear = new Date(together);

	return currentMonthAndYear;
}
