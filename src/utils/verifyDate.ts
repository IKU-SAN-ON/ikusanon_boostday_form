/**
 * This function verifies whether a given date string is valid.
 */

export function verifyDate(date: Date, today: Date): boolean {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Set to tomorrow's date
  tomorrow.setHours(0, 0, 0, 0); // Set time to the start of the day

  const nextMonthFirstDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
  ); // First day of the next month
  const twoMonthFirstDay = new Date(
    nextMonthFirstDay.getFullYear(),
    nextMonthFirstDay.getMonth() + 1,
    1,
  ); // First day of the month after next

  return date >= tomorrow && date < twoMonthFirstDay;
}

/**
 *
 * This function calculates the valid date range for boost day proposals based on the current date. The valid range starts from tomorrow and ends at the first day of the month after next.
 *
 * @returns An object containing the start and end dates of the valid range for boost day proposals.
 */
export function getRangeOfValidDates(today: Date): { start: Date; end: Date } {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Set to tomorrow's date
  tomorrow.setHours(0, 0, 0, 0); // Set time to the start of the day

  const nextMonthFirstDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
  ); // First day of the next month
  const twoMonthFirstDay = new Date(
    nextMonthFirstDay.getFullYear(),
    nextMonthFirstDay.getMonth() + 1,
    1,
  ); // First day of the month after next

  return { start: tomorrow, end: twoMonthFirstDay };
}
