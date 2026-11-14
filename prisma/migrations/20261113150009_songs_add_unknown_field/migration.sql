/*
  Warnings:

  - Added the required column `unknown` to the `chunithmSong` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chunithmSong" ADD COLUMN     "unknown" BOOLEAN NOT NULL;
