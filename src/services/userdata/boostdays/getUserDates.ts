import { prisma } from "@/lib/prisma";

/**
 * This function retrieves the dates associated with a user.
 * 
 * It fetches all date records for the specified user from the database and returns them as an array of Date objects.
 * 
 * @param userId The ID of the user for whom to retrieve the dates.
 * @return An array of Date objects representing the user's dates.
 * @throws Error if there is an issue with the database operation.
 */
export default async function getUserDates(userId: string): Promise<Date[]> {
  try {
    // Fetch the dates associated with the user
    const userDates = await prisma.availability.findMany({
      where: { userId: userId },
      select: { date: true },
    });

    // Return the dates as an array of Date objects
    return userDates.map(record => record.date);

  } catch (error) {
    console.error('Error in getUserDates:', error);
    throw error;
  }
}


/**
 * This function retrieves the dates associated with a user for a specific year and month.
 * 
 * @param userId The ID of the user for whom to retrieve the dates.
 * @param year The year for which to retrieve the dates.
 * @param month The month (0-11) for which to retrieve the dates.
 * @returns A promise that resolves to an array of Date objects.
 */
export async function getUserDateByYearMonth(userId: string, year: number, month: number): Promise<Date[]> {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Last day of the month

  const userDates = await prisma.availability.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { date: true, createdAt: true },
    orderBy: { date: "asc" },
  });

  return userDates.map(record => record.date);
}