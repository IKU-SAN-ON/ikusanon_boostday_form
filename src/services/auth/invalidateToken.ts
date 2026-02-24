import { prisma } from "@/lib/prisma";

import { InvalidTokenError } from "@/lib/errors";
import getTokenSession from "./getTokenSession";

/**
 * This function invalidates a token.
 * 
 * It deletes the token session associated with the provided token from the database, effectively invalidating it.
 * 
 * @param token The token of the user for whom to update the dates.
 * @throws Error if there is an issue with the database operation.
 */
export default async function invalidateToken(token: string): Promise<void> {
  try {
    // Validate the token
    await getTokenSession(token);
    // Delete the token session associated with the provided token
    await prisma.tokenSession.delete({
      where: { token },
    });
  } catch (error) {
    if (error instanceof InvalidTokenError) {
      console.info('invalidateToken: Attempted to invalidate an already invalid token:', token);
      return; // Token is already invalid, so we can just return
    }
    console.error('Error in invalidateToken:', error);
    throw error;
  }
}