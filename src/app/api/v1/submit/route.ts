import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  SubmitDataRequestSchema,
  SubmitDataResponseSchema,
} from "@/lib/definitions";
import { InvalidTokenError } from "@/lib/errors";
import getTokenSession from "@/services/auth/getTokenSession";
import submitUserDates from "@/services/userdata/boostdays/submitUserDates";

import { verifyDate } from "@/utils/verifyDate";

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    console.log("Received submission data:", requestData);

    const { token, selectedDates } = SubmitDataRequestSchema.parse(requestData);

    // Verify Date selection (> today, < end of next month)
    const today = new Date();
    if (
      !selectedDates.every((date) => {
        return verifyDate(date, today);
      })
    ) {
      return NextResponse.json(
        SubmitDataResponseSchema.parse({
          success: false,
          message:
            "Selected dates must be in the future and within the next month.",
        }),
        { status: 400 },
      );
    }

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
