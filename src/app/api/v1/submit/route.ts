import { z } from "zod";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { SubmitDataRequestSchema, SubmitDataResponseSchema } from "@/lib/definitions";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    console.log("Received submission data:", requestData);
    const parsedData = SubmitDataRequestSchema.parse(requestData);

    // validate token and userId here
    await prisma.tokenSession.findFirstOrThrow({
      where: {
        token: parsedData.token,
        userId: parsedData.userId,
      },
    });

    // Clear existing availability data for the user
    await prisma.availability.deleteMany({
      where: { userId: parsedData.userId },
    });

    await prisma.availability.createMany({
      data: parsedData.selectedDates.map(date => ({
        userId: parsedData.userId,
        date: date,
      })),
    });

    return NextResponse.json(SubmitDataResponseSchema.parse({ success: true, message: "Dates submitted successfully." }));
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(SubmitDataResponseSchema.parse({ success: false, message: "Invalid data provided." }), { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(SubmitDataResponseSchema.parse({ success: false, message: "Token expired or invalid, or userId does not match with token." }), { status: 400 });
    }
    console.error('Error submitting dates:', error);
    return NextResponse.json(SubmitDataResponseSchema.parse({ success: false, message: "Internal Server Error." }), { status: 500 });
  }
}