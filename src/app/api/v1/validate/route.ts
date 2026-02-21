import { z } from "zod";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { validateRequestSchema, validateResponseSchema } from "@/lib/definitions";

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const { token } = validateRequestSchema.parse(requestBody);

    const tokenSession = await prisma.tokenSession.findUnique({
      where: { token },
    });
  
    if (!tokenSession || tokenSession.expiresAt < new Date()) {
      return NextResponse.json(validateResponseSchema.parse({ valid: false, userId: null }));
    }

    return NextResponse.json(validateResponseSchema.parse({ valid: true, userId: tokenSession.userId }));
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.error('Error validating token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}