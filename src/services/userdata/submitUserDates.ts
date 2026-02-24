import { prisma } from "@/lib/prisma";

import getTokenSession from "@/services/auth/getTokenSession";

import invalidateToken from "@/services/auth/invalidateToken";

/**
 * This function updates the dates associated with a user.
 * 
 * It first validates the provided token to ensure it is associated with a valid user session. 
 * Then, it deletes any existing date records for the user and creates new records based on the provided array of dates.
 * 
 * @param token The token of the user for whom to update the dates.
 * @param dates An array of Date objects representing the new dates to be associated with the user.
 * @throws InvalidTokenError if the provided token is invalid or expired.
 * @throws Error if there is an issue with the database operation.
 */
export default async function submitUserDates(token: string, dates: Date[]): Promise<void> {
  try {
    // Find the user associated with the provided token
    const userId = await getTokenSession(token);

    // Start a transaction to ensure atomicity of the operations
    await prisma.$transaction(async (prisma) => {
      // Delete existing date records for the user
      await prisma.availability.deleteMany({
        where: { userId: userId },
      });

      // Create new date records for the user
      const newRecords = dates.map(date => ({
        userId: userId,
        date: date,
      }));
      await prisma.availability.createMany({
        data: newRecords,
      });

      await invalidateToken(token);
    });

  } catch (error) {
    console.error('Error in submitUserDates:', error);
    throw error;
  }
}