import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";

import { InvalidTokenError } from "@/lib/errors";

import getTokenSession from "@/services/auth/getTokenSession";
import submitUserDates from "@/services/userdata/boostdays/submitUserDates";

import {
  SubmitDataRequestSchema,
  SubmitDataResponseSchema,
} from "@/lib/definitions";

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log("Received submission data:", requestData);

    const { token, selectedDates } = SubmitDataRequestSchema.parse(requestData);

    const userId = await getTokenSession(token);
    await submitUserDates(userId, selectedDates, token);

    return NextResponse.json(
      SubmitDataResponseSchema.parse({
        success: true,
        message: "Dates submitted successfully.",
      }),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        SubmitDataResponseSchema.parse({
          success: false,
          message: "Invalid data provided.",
        }),
        { status: 400 },
      );
    }
    if (error instanceof InvalidTokenError) {
      return NextResponse.json(
        SubmitDataResponseSchema.parse({
          success: false,
          message: "Token expired or invalid.",
        }),
        { status: 401 },
      );
    }
    console.error("Error submitting dates:", error);
    return NextResponse.json(
      SubmitDataResponseSchema.parse({
        success: false,
        message: "Internal Server Error.",
      }),
      { status: 500 },
    );
  }
}
