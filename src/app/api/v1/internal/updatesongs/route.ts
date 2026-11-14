import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { chunithmSongsRequestSchema } from "@/lib/definitions";
import { upsertChuSongs } from "@/services/songs/upsertchusongs";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const songsData = chunithmSongsRequestSchema.parse(requestBody);

    // Use Prisma to insert the songs into the database or update if they already exist
    await upsertChuSongs(songsData);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.warn("tokengen: Invalid JSON in request body:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (err instanceof TypeError) {
      console.warn("tokengen: Request body is not JSON:", err);
      return NextResponse.json(
        { error: "Request body must be JSON" },
        { status: 400 },
      );
    }
    if (err instanceof z.ZodError) {
      console.warn("updatesongs: Validation error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("updatesongs: Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
