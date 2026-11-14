/*
  Warnings:

  - Added the required column `search_terms` to the `chunithmSong` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chunithmSong" ADD COLUMN     "search_terms" TEXT NOT NULL;
