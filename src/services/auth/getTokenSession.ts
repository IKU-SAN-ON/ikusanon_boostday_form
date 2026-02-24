import { prisma } from "@/lib/prisma";

import { InvalidTokenError } from "@/lib/errors";

/** 
 * This function gets the user ID associated with a valid token session.
 * 
 * @param token The token to be validated.
 * @returns The user ID associated with the valid token.
 * @throws InvalidTokenError if the token is invalid or expired.
 * @throws Will throw an error if the database operation fails.
 */
export default async function getTokenSession(token: string): Promise<string> {
  try {

    // Find the token session in the database
    const tokenSession = await prisma.tokenSession.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    });

    // Check if the token session exists and is not expired
    if (!tokenSession || tokenSession.expiresAt < new Date()) {
      console.warn('getTokenSession: Invalid or expired token:', token);
      throw new InvalidTokenError('Invalid token');
    }

    return tokenSession.userId;
    
  } catch (error) {
    console.error('Error in getTokenSession:', error);
    throw error;
  }
}