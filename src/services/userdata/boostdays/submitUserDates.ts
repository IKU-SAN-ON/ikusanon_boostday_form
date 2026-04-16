import { prisma } from "@/lib/prisma";

/**
 * This function updates the dates associated with a user.
 *
 * It first validates the provided token to ensure it is associated with a valid user session.
 * Then, it deletes any existing date records for the user and creates new records based on the provided array of dates.
 *
 * It also invalidates the user's token after updating.
 *
 * @param userId The ID of the user for whom to update the dates.
 * @param dates An array of Date objects representing the new dates to be associated with the user.
 * @param token The authentication token to validate the user's session.
 * @throws InvalidTokenError if the provided token is invalid or expired.
 * @throws Error if there is an issue with the database operation.
 */
export default async function submitUserDates(
  userId: string,
  dates: Date[],
  token: string,
): Promise<void> {
  try {
    // Create new date records for the user
    const newRecords = dates.map((date) => ({
      userId: userId,
      date: date,
    }));
    // Start a transaction to ensure atomicity of the operations
    await prisma.$transaction(async (prisma) => {
      // Delete existing date records for the user
      await prisma.availability.deleteMany({
        where: { userId: userId },
      });

      await prisma.availability.createMany({
        data: newRecords,
      });
      // Invalidate the user's token to ensure they need to re-authenticate
      await prisma.tokenSession.delete({
        where: { token },
      });
    });
  } catch (error) {
    console.error("Error in submitUserDates:", error);
    throw error;
  }
}
