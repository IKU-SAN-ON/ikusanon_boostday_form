import { z } from 'zod';

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

import { tokenGenRequestSchema, tokenGenResponseSchema } from '@/lib/definitions';

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { userId } = tokenGenRequestSchema.parse(requestBody);

    // Check if token already exists for the user and is still valid
    const existingToken = await prisma.tokenSession.findFirst({
      where: {
        userId: userId,
        expiresAt: {
          gt: new Date(), // Token is still valid
        },
      },
    });

    if (existingToken) {
      // update the expiration time of the existing token
      const updatedToken = await prisma.tokenSession.update({
        where: { id: existingToken.id },
        data: { expiresAt: new Date(Date.now() + 30 * 60 * 1000) }, // Extend expiration by 30 mins
      });
      
      return NextResponse.json(tokenGenResponseSchema.parse({ token: updatedToken.token, expiresAt: updatedToken.expiresAt }));
    }

    // Create a new token session for the user
    const { token, expiresAt } = await prisma.tokenSession.create({
      data: {
        token: crypto.randomUUID(), // Generate a random token
        userId: userId,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Token expires in 30 mins
      }
    });

    return NextResponse.json(tokenGenResponseSchema.parse({ token, expiresAt }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}