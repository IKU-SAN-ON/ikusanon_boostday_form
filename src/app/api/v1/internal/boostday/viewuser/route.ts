import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getUserDateByYearMonth } from "@/services/userdata/boostdays/getUserDates";

export async function GET(request: NextRequest) {
  const now = new Date();

  const ViewUserDateRequestSchema = z.object({
    userId: z.coerce
      .string()
      .min(17)
      .max(22)
      .regex(/^\d+$/, "userId must be a numeric string"),
    year: z.coerce
      .number()
      .min(now.getFullYear() - 10)
      .max(now.getFullYear() + 10),
    month: z.coerce.number().min(1).max(12),
  });

  try {
    const params = new URL(request.url).searchParams;
    const { userId, year, month } = ViewUserDateRequestSchema.parse({
      userId: params.get("userId"),
      year: params.get("year"),
      month: params.get("month"),
    });

    const userDates = await getUserDateByYearMonth(userId, year, month - 1);

    return NextResponse.json({ success: true, data: userDates });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "Validation error in GET /api/v1/internal/boostday/viewuser:",
        error,
      );
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error },
        { status: 400 },
      );
    }
    console.error("Error in GET /api/v1/internal/boostday/viewuser:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve user dates" },
      { status: 500 },
    );
  }
}
