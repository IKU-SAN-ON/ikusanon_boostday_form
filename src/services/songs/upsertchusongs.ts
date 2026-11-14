import type { ChunithmSong } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { buildSearchText } from "@/utils/buildSearchText";

/**
 * Upserts a list of Chunithm songs into the database. It will create new songs, update existing ones, and delete songs that are no longer present in the incoming data.
 * @param incomingSongs - An array of ChunithmSong objects to be upserted.
 * @returns A promise that resolves when the operation is complete.
 * @throws Will throw an error if the database operation fails.
 */
export async function upsertChuSongs(
  incomingSongs: ChunithmSong[],
): Promise<void> {
  try {
    const existingSongs = await prisma.chunithmSong.findMany({
      select: {
        id: true,
        title: true,
        artist: true,
        difficulty: true,
        notes: true,
        const: true,
        chunirec_id: true,
        unknown: true,
      },
    });

    const existingSongMap = new Map(
      existingSongs.map((song) => [
        `${song.chunirec_id}-${song.difficulty}`,
        song,
      ]),
    );

    const incomingKeys = new Set(
      incomingSongs.map(
        (incomingSong) => `${incomingSong.chunirec_id}-${incomingSong.diff}`,
      ),
    );
    const toCreate: ChunithmSong[] = [];
    const toUpdate: {
      id: number;
      data: Partial<ChunithmSong>;
      newSearchTerms: string;
    }[] = [];

    for (const incomingSong of incomingSongs) {
      const key = `${incomingSong.chunirec_id}-${incomingSong.diff}`;

      const existingSong = existingSongMap.get(key);

      if (!existingSong) {
        // DNE, so will create
        toCreate.push(incomingSong);
      } else {
        // check if key fields changed
        const isChanged =
          existingSong.const !== incomingSong.const ||
          existingSong.title !== incomingSong.title ||
          existingSong.unknown !== incomingSong.unknown ||
          existingSong.artist !== incomingSong.artist ||
          existingSong.notes !== incomingSong.notes;

        if (isChanged) {
          toUpdate.push({
            id: existingSong.id,
            data: {
              title: incomingSong.title,
              artist: incomingSong.artist,
              const: incomingSong.const,
              notes: incomingSong.notes,
              unknown: incomingSong.unknown,
            },
            newSearchTerms: buildSearchText(incomingSong),
          });
        }
      }
    }

    // find songs that exist in the database but not in the incoming data
    const toDelete = existingSongs
      .filter(
        (existingSong) =>
          !incomingKeys.has(
            `${existingSong.chunirec_id}-${existingSong.difficulty}`,
          ),
      )
      .map((song) => song.id);

    // Perform the database operations in a transaction
    await prisma.$transaction(async (prisma) => {
      // Create new songs
      if (toCreate.length > 0) {
        await prisma.chunithmSong.createMany({
          data: toCreate.map((song) => ({
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            const: song.const,
            difficulty: song.diff,
            notes: song.notes,
            unknown: song.unknown,
            chunirec_id: song.chunirec_id,
            search_terms: buildSearchText(song),
          })),
        });
      }

      // Update existing songs
      for (const update of toUpdate) {
        await prisma.chunithmSong.update({
          where: { id: update.id },
          data: {
            ...update.data,
            search_terms: update.newSearchTerms,
          },
        });
      }

      // Delete songs that are no longer present in the incoming data
      if (toDelete.length > 0) {
        await prisma.chunithmSong.deleteMany({
          where: { id: { in: toDelete } },
        });
      }
    });
  } catch (error) {
    console.error("Error in upsertChuSongs:", error);
    throw error;
  }
}
