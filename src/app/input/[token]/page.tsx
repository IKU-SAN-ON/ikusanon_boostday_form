'use server';

import InputPageClientSide from "./InputPageClientSide";

import { validateRequestSchema } from "@/lib/definitions";

import { prisma } from "@/lib/prisma";

import { forbidden } from "next/navigation";

const InputPageServerWrapper = async ({params} : {params: Promise<{token: string}>}) => {
  
  const { token } = await params;
  try {
    validateRequestSchema.parse({ token });
  } catch (error) {
    console.error('Invalid token format:', error);
    forbidden();
  }

  const tokenSession = await prisma.tokenSession.findUnique({
    where: { token },
  });

  if (!tokenSession || tokenSession.expiresAt < new Date()) {
    forbidden();
  }

  const selectedDates = await prisma.availability.findMany({
    where: { userId: tokenSession.userId },
    select: { date: true },
  });

  return (<InputPageClientSide userId={tokenSession.userId} token={token} previousData={selectedDates.map(d => d.date)}/>);
}

export default InputPageServerWrapper;