import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAllDatesByYearMonth } from "@/services/userdata/boostdays/getAllDates";

export async function GET(request: NextRequest) {
  const now = new Date();

  const ViewAllDatesRequestSchema = z.object({
    year: z.coerce
      .number()
      .min(now.getFullYear() - 10)
      .max(now.getFullYear() + 10),
    month: z.coerce.number().min(1).max(12),
  });

  try {
    const params = new URL(request.url).searchParams;
    const { year, month } = ViewAllDatesRequestSchema.parse({
      year: params.get("year"),
      month: params.get("month"),
    });

    const boostdayDates = await getAllDatesByYearMonth(year, month - 1); // Adjust month for zero-based index,
    // I still don't fucking understand why JS uses 0-11 for months, it's so counterintuitive.

    return NextResponse.json({ success: true, data: boostdayDates });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "Validation error in GET /api/v1/internal/boostday/viewall:",
        error,
      );
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error },
        { status: 400 },
      );
    }
    console.error("Error in GET /api/v1/internal/boostday/viewall:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
