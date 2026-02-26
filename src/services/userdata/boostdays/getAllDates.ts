import { prisma } from "@/lib/prisma";

/**
 * This function retrieves all dates from the database, along with the associated user information.
 * 
 * @returns An array of objects, each containing a date and the corresponding userId.
 * @throws Error if there is an issue with the database operation.
 */
export default async function getAllDates(): Promise<{ date: Date, userId: string }[]> {
  try {
    // Fetch all date records along with user information from the database
    const allDatesWithUserInfo = await prisma.availability.findMany({
      select: { date: true, userId: true },
      orderBy: { date: "asc" }
    });

    return allDatesWithUserInfo;
  } catch (error) {
    console.error('Error in getAllDatesWithUserInfo:', error);
    throw error;
  }
}

/**
 * This function retrieves all dates from the database for a specific year and month, with user information.
 * 
 * It filters the records based on the provided year and month, returning only those that fall within the specified range.
 * 
 * @param year The year for which to retrieve the dates.
 * @param month The month (0-11) for which to retrieve the dates.
 * @returns An array of objects, each containing a date and the corresponding userId for the specified year and month.
 * @throws Error if there is an issue with the database operation.
 */
export async function getAllDatesByYearMonth(year: number, month: number): Promise<{ date: Date, userId: string }[]> {
  const startDate = new Date(year, month, 1); // Start of the month
  const endDate = new Date(year, month + 1, 0); // End of the month

  try {
    const allDates = await prisma.availability.findMany({
      select: { date: true, userId: true },
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        }
      },
      orderBy: { date: "asc" }
    });

    return allDates;
  } catch (error) {
    console.error('Error in getAllDatesByYearMonth:', error);
    throw error;
  }
}