import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  tokenGenRequestSchema,
  tokenGenResponseSchema,
} from "@/lib/definitions";
import getNewToken from "@/services/auth/getNewToken";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { userId } = tokenGenRequestSchema.parse(requestBody);
    const { token, expiresAt } = await getNewToken(userId);

    const responseData = tokenGenResponseSchema.parse({ token, expiresAt });
    return NextResponse.json(responseData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn("tokengen: Invalid JSON in request body:", error);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (error instanceof TypeError) {
      console.warn("tokengen: Request body is not JSON:", error);
      return NextResponse.json(
        { error: "Request body must be JSON" },
        { status: 400 },
      );
    }
    if (error instanceof z.ZodError) {
      console.warn("tokengen: Validation error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("tokengen: Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
