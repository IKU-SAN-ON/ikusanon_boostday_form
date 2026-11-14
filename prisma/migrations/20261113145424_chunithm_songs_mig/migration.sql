-- CreateEnum
CREATE TYPE "chunithmDifficulty" AS ENUM ('BAS', 'ADV', 'EXP', 'MAS', 'ULT');

-- CreateTable
CREATE TABLE "chunithmSong" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "const" DOUBLE PRECISION NOT NULL,
    "difficulty" "chunithmDifficulty" NOT NULL,
    "chunirec_id" TEXT NOT NULL,
    "notes" INTEGER NOT NULL,

    CONSTRAINT "chunithmSong_pkey" PRIMARY KEY ("id")
);
