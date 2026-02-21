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

  return (
    <div>
      <h1>Input Page (Server Side)</h1>
      <InputPageClientSide userId={tokenSession.userId} />
    </div>
  );
}

export default InputPageServerWrapper;