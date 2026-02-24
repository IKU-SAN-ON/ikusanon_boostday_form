import { prisma } from '@/lib/prisma';

/**
 * This function fetches, or generates, a new token for the user.
 * 
 * If a valid token already exists for the user, it will return that token and extend its expiration time.
 * If no valid token exists, it will create a new token for the user and return it.
 * 
 * The token is valid for 30 minutes from the time of creation or extension.
 * 
 * @param userId The ID of the user for whom to fetch or generate a token.
 * @returns An object containing the token and its expiration time.
 * @throws Will throw an error if there is an issue with the database operation.
 */
export default async function getNewToken(userId: string) {
  try {
    // Check if token already exists for the user and is still valid
    const existingToken = await prisma.tokenSession.findFirst({
      where: {
        userId: userId,
        expiresAt: {
          gt: new Date(), // Token is still valid
        },
      },
    });

    // If a valid token exists, update its expiration time and return it
    if (existingToken) {
      // update the expiration time of the existing token
      const updatedToken = await prisma.tokenSession.update({
        where: { id: existingToken.id },
        data: { expiresAt: new Date(Date.now() + 30 * 60 * 1000) }, // Extend expiration by 30 mins
      });
      return { token: updatedToken.token, expiresAt: updatedToken.expiresAt };
    }

    // Create a new token session for the user
    const { token, expiresAt } = await prisma.tokenSession.create({
      data: {
        token: crypto.randomUUID(), // Generate a random token
        userId: userId,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Token expires in 30 mins
      }
    });

    return { token, expiresAt };
  } catch (error) {
    console.error('Error in getNewToken:', error);
    throw error;
  }
}
