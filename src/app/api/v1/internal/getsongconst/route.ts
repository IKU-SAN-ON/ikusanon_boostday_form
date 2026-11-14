import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSongConstantRequestSchema } from "@/lib/definitions";
import { getSongs } from "@/services/songs/getsong";

export async function GET(request: NextRequest) {
  try {
    const params = new URL(request.url).searchParams;
    const { q, diff } = getSongConstantRequestSchema.parse({
      q: params.get("q"),
      diff: params.get("diff"),
    });

    const matches = await getSongs(q, 3, diff);
    const data = matches.map((song) => ({
      title: song.title,
      diff: song.difficulty,
      constant: song.const,
      unknown: song.unknown,
      chunirec_id: song.chunirec_id,
    }));

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn("getsongconst: Invalid query parameters:", error.message);
      return NextResponse.json(
        {
          success: false,
          error:
            "Both q and diff are required. Diff must be one of BAS, ADV, EXP, MAS, ULT",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("getsongconst: Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
