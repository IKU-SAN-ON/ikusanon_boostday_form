import { prisma } from "@/lib/prisma";

import getTokenSession from "@/services/auth/getTokenSession";

/**
 * This function retrieves the dates associated with a user.
 * 
 * It fetches all date records for the specified user from the database and returns them as an array of Date objects.
 * 
 * @param token The token of the user for whom to retrieve the dates.
 * @return An array of Date objects representing the user's dates.
 * @throws InvalidTokenError if the provided token is invalid or expired.
 * @throws Error if there is an issue with the database operation.
 */
export default async function getUserDates(token: string): Promise<Date[]> {
  try {
    // Find the user associated with the provided token
    const userId = await getTokenSession(token);

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